import slugify from "slugify";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { MEDIA_ROOT, configuration } from "../utils";
import { Request } from "express";
import { APIException } from "../shared/exceprions";

export const ensureFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const filter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    req.query.fileType === "image" &&
    file.mimetype.split("/")[0] !== "image"
  ) {
    cb(
      new APIException(400, {
        [req.body.fieldName]: {
          _errors: ["Only images are allowed"],
        },
      })
    );
  } else {
    cb(null, true);
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

const diskFile = ({ dest }: { dest: string }) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationFolder = path.join(MEDIA_ROOT, dest);
      ensureFolderExists(destinationFolder);
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
      cb(null, renameFile(file.originalname));
    },
  });

  return multer({ storage, fileFilter: filter });
};

// const uploads = multer({ dest: "../media/uploads" });

const memoryFile = () => {
  const storage = multer.memoryStorage();
  return multer({ storage, fileFilter: filter });
};

const uploader = {
  diskFile,
  memoryFile,
};

export default uploader;
