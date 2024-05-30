import multer, { Field, FileFilterCallback, DiskStorageOptions } from "multer";
import { NextFunction, Request, Response } from "express";
import { APIException } from "@/shared/exceprions";
import path from "path/posix";
import fs from "fs";
import { configuration, MEDIA_ROOT } from "@/utils";
import slugify from "slugify";
import { isEmpty } from "lodash";
import sharp from "sharp";
import { addRollBackTaskToQueue } from "@/shared/tasks";
import logger from "@/shared/logger";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);

const filter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  cb(null, true);
};

const diskStorage = (uploadPath: string) => {
  const storage: DiskStorageOptions = {
    destination: (req, file, cb) => {
      const destinationFolder = path.join(MEDIA_ROOT, uploadPath);
      ensureFolderExists(destinationFolder);
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
      const sanitizedFilename = sanitizeFilename(file.originalname);
      const uniqueName = renameFile(sanitizedFilename);
      cb(null, uniqueName);
    },
  };
  return multer({ storage: multer.diskStorage(storage), fileFilter: filter });
};

export const ensureFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

export const renameFile = (fileName: string) =>
  slugify(configuration.name) +
  "-" +
  slugify(configuration.version) +
  "-" +
  Date.now() +
  "-" +
  slugify(fileName, { lower: true, trim: true });

const saveFile = async (
  file: Express.Multer.File,
  relativeSavePath: string
) => {
  try {
    const { fieldname, filename, originalname, path: filePath } = file;

    const saveAbsolutePath = path.join(MEDIA_ROOT, relativeSavePath, filename);
    const saveRelativePath = path.join(relativeSavePath, filename);

    await fs.promises.rename(filePath, saveAbsolutePath);
    return {
      absolute: saveAbsolutePath,
      relative: saveRelativePath,
    };
  } catch (error: any) {
    throw new APIException(400, {
      [file.fieldname]: { _errors: [error.message] },
    });
  }
};

const sanitizeFilename = (filename: string) =>
  filename.replace(/[^\w\s.-]/gi, "");

const deleteFileAsync = (filePath: string, delayed = 3000, retryCount = 3) => {
  return new Promise<void>((resolve, reject) => {
    const attemptDelete = (retries: number) => {
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) {
            if (err.code === "EPERM" && retries > 0) {
              // Retry if EPERM error occurs
              logger.warn(
                `Retrying delete for ${filePath}. Retries left: ${retries - 1}`
              );
              return attemptDelete(retries - 1);
            }
            return reject(err);
          }
          return resolve();
        });
      }, delayed);
    };
    attemptDelete(retryCount);
  });
};

// Save imahe with shape and compress then remove initial one
const saveImage = async (
  image: Express.Multer.File,
  relativeSavePath: string,
  options?: {
    width: number;
    height: number;
    isGrayScale?: boolean;
    fit?: keyof sharp.FitEnum;
    quality?: number; // New option for quality
  }
) => {
  try {
    const { fieldname, filename, originalname, path: filePath } = image;
    // Rename to jpeg
    const fileNameWithoutExtension = filename.slice(
      0,
      filename.lastIndexOf(".")
    );
    const newFileName = `${fileNameWithoutExtension}.jpeg`;

    const saveAbsolutePath = path.join(
      MEDIA_ROOT,
      relativeSavePath,
      newFileName
    );
    const saveRelativePath = path.join(relativeSavePath, newFileName);

    // Ta avoid EPERM Error since sharp dont releaase file lock when passed path
    // Read the file mannually and parse the buffere
    const buffer = await readFileAsync(filePath);
    await sharp(buffer)
      .jpeg({ mozjpeg: true, quality: options?.quality ?? 80 }) // Adjust quality
      .resize(options?.width, options?.height, { fit: options?.fit })
      .grayscale(options?.isGrayScale ?? false)
      .toFile(saveAbsolutePath);
    deleteFileAsync(filePath)
      .catch((er) => logger.error(`${er}`))
      .then((_) =>
        logger.info(`Deleted sucesfully temporary file -> ${filePath}`)
      ); //Delete temporary file in background

    return {
      absolute: saveAbsolutePath,
      relative: saveRelativePath,
    };
  } catch (error: any) {
    throw new APIException(400, {
      [image.fieldname]: { _errors: [error.message] },
    });
  }
};

const fileUploader = {
  postUpload: (uploadPath?: string) => {
    const storagePath = path.join(MEDIA_ROOT, uploadPath ?? "");
    ensureFolderExists(storagePath);
    return {
      fields(fields: (Field & { mode?: "single" | "array" })[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
          try {
            const files = req.files as {
              [fieldname: string]: Express.Multer.File[];
            };
            if (!isEmpty(files)) {
              for (const field of fields) {
                const _mode = field.mode ?? "array";
                const fileList = files[field.name] ?? [];

                // TODO Add Rollbacks to handle early errors


                // Assertain that if mode is single only one file is provded
                if (_mode == "single" && fileList.length > 1)
                  throw new APIException(400, {
                    [field.name]: {
                      _errors: [
                        `Espected single file for ${field.name} but received ${fileList.length}`,
                      ],
                    },
                  });
                // Process images and files if all test are passed
                for (const file of fileList) {
                  let _file: { absolute: string; relative: string };
                  if (file.mimetype.split("/")[0] === "image") {
                    _file = await saveImage(file, uploadPath ?? "");
                  } else {
                    _file = await saveFile(file, uploadPath ?? "");
                  }
                  if (_mode == "single") {
                    req.body[field.name] = _file.relative;
                  } else {
                    //   Add file relative to request body
                    req.body[field.name] = req.body[field.name] ?? []; //Ensure field is initialized
                    (req.body[field.name] as any[]).push(_file.relative);
                  }
                  //   Setup Roleback for uploaded files in queur
                  addRollBackTaskToQueue(req, async () => {
                    await deleteFileAsync(_file.absolute);
                    return `${_file.absolute} Rolled back successfully!`;
                  });
                }
              }
            }
            return next();
          } catch (error) {
            return next(error);
          }
        };
      },
    };
  },
  diskStorage,
};

export default fileUploader;
