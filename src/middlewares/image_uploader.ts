import multer, { Field, FileFilterCallback } from "multer";
import { NextFunction, Request, Response } from "express";
import { APIException } from "@/shared/exceprions";
import path from "path/posix";
import fs from "fs";
import { configuration, MEDIA_ROOT } from "@/utils";
import slugify from "slugify";
import { isEmpty, zip } from "lodash";
import sharp from "sharp";
import { addRollBackTaskToQueue } from "@/shared/tasks";

const filter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.split("/")[0] !== "image") {
    cb(
      new APIException(400, {
        _errors: ["Only image files are allowed"],
      })
    );
  } else {
    cb(null, true);
  }
};

const memoryImage = () => {
  const storage = multer.memoryStorage();
  return multer({ storage, fileFilter: filter });
};

const filesToPathArray = (files: any, uploadPath: string): string[] => {
  return Array.from((files as Express.Multer.File[] | undefined) ?? []).map(
    ({ filename, originalname }) =>
      path.join(uploadPath, filename ?? originalname)
  );
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

const generateFilePath = (filePath: string) => {
  const fileNameWithoutExtension = filePath.slice(0, filePath.lastIndexOf("."));
  const newPath = `${fileNameWithoutExtension}.jpeg`;
  const fileName = path.basename(newPath);
  const dirName = path.dirname(newPath);
  return path.join(dirName, renameFile(fileName));
};

const saveImages = async (
  files: Express.Multer.File[],
  savePathRelative: string,
  options?: {
    width: number;
    height: number;
    isGrayScale?: boolean;
    fit?: keyof sharp.FitEnum;
    quality?: number; // New option for quality
  }
) => {
  const filePaths = filesToPathArray(files, savePathRelative).map(
    generateFilePath
  );

  const uploadTasks = zip(filePaths, files).map(([path_, file]) =>
    sharp(file!.buffer)
      .jpeg({ mozjpeg: true, quality: options?.quality ?? 80 }) // Adjust quality
      .resize(options?.width, options?.height, { fit: options?.fit })
      .grayscale(options?.isGrayScale ?? false)
      .toFile(path.join(MEDIA_ROOT, path_!))
  );

  const saved = await Promise.all(uploadTasks);
  return saved.map((outputInfo, index) => ({
    outputInfo,
    relative: filePaths[index],
    absolute: path.join(MEDIA_ROOT, filePaths[index]),
  }));
};

const sanitizeFilename = (filename: string) =>
  filename.replace(/[^\w\s.-]/gi, "");

const deleteFileAsync = (filePath: string) =>
  new Promise<void>((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });

const rollBackFileUploads = async (absolutePaths: string[]) => {
  await Promise.all(absolutePaths.map(deleteFileAsync));
};

const imageUploader = {
  postImageUpload: (uploadPath?: string) => {
    // Ensure folder exist
    ensureFolderExists(path.join(MEDIA_ROOT, uploadPath ?? ""));

    return {
      single(fieldName: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
          try {
            if (req.file) {
              const uploaded = await saveImages([req.file], uploadPath ?? "");
              req.body[fieldName] = uploaded[0].relative;
              addRollBackTaskToQueue(req, async () => {
                await rollBackFileUploads([uploaded[0].absolute]);
                return `[+]Files ${uploaded[0].absolute} rolled back suceesfully`;
              });
            } else {
              // For update operations acceppt path of the image for non updated files only require files hence set to udefined
              // TODO Can perfome image path validation in the controller
              if (["PUT", "PATCH"].includes(req.method)) {
              } else req.body[fieldName] = undefined;
            }

            return next();
          } catch (error) {
            return next(error);
          }
        };
      },
      array(fieldName: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
          try {
            if ((req.files as any)?.length > 0) {
              const uploaded = await saveImages(
                req.files as any,
                uploadPath ?? ""
              );
              req.body[fieldName] = uploaded.map((o) => o.relative);
            } else {
              req.body[fieldName] = [];
            }
            return next();
          } catch (error) {
            return next(error);
          }
        };
      },
      fields(fields: Field[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
          try {
            const files = req.files as {
              [fieldname: string]: Express.Multer.File[];
            };
            if (!isEmpty(files)) {
              for (const field of fields) {
                const uploaded = await saveImages(
                  files[field.name],
                  uploadPath ?? ""
                );
                req.body[field.name] = uploaded.map((o) => o.relative);
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
  memoryImage,
};

export default imageUploader;
