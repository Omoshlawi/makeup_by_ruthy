"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameFile = exports.ensureFolderExists = void 0;
const multer_1 = __importDefault(require("multer"));
const exceprions_1 = require("../shared/exceprions");
const posix_1 = __importDefault(require("path/posix"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
const slugify_1 = __importDefault(require("slugify"));
const lodash_1 = require("lodash");
const sharp_1 = __importDefault(require("sharp"));
const tasks_1 = require("../shared/tasks");
const logger_1 = __importDefault(require("../shared/logger"));
const util_1 = require("util");
const readFileAsync = (0, util_1.promisify)(fs_1.default.readFile);
const filter = (req, file, cb) => {
    cb(null, true);
};
const diskStorage = (uploadPath) => {
    const storage = {
        destination: (req, file, cb) => {
            const destinationFolder = posix_1.default.join(utils_1.MEDIA_ROOT, uploadPath);
            (0, exports.ensureFolderExists)(destinationFolder);
            cb(null, destinationFolder);
        },
        filename: (req, file, cb) => {
            const sanitizedFilename = sanitizeFilename(file.originalname);
            const uniqueName = (0, exports.renameFile)(sanitizedFilename);
            cb(null, uniqueName);
        },
    };
    return (0, multer_1.default)({ storage: multer_1.default.diskStorage(storage), fileFilter: filter });
};
const ensureFolderExists = (folderPath) => {
    if (!fs_1.default.existsSync(folderPath)) {
        fs_1.default.mkdirSync(folderPath, { recursive: true });
    }
};
exports.ensureFolderExists = ensureFolderExists;
const renameFile = (fileName) => (0, slugify_1.default)(utils_1.configuration.name) +
    "-" +
    (0, slugify_1.default)(utils_1.configuration.version) +
    "-" +
    Date.now() +
    "-" +
    (0, slugify_1.default)(fileName, { lower: true, trim: true });
exports.renameFile = renameFile;
const saveFile = (file, relativeSavePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fieldname, filename, originalname, path: filePath } = file;
        const saveAbsolutePath = posix_1.default.join(utils_1.MEDIA_ROOT, relativeSavePath, filename);
        const saveRelativePath = posix_1.default.join(relativeSavePath, filename);
        yield fs_1.default.promises.rename(filePath, saveAbsolutePath);
        return {
            absolute: saveAbsolutePath,
            relative: saveRelativePath,
        };
    }
    catch (error) {
        throw new exceprions_1.APIException(400, {
            [file.fieldname]: { _errors: [error.message] },
        });
    }
});
const sanitizeFilename = (filename) => filename.replace(/[^\w\s.-]/gi, "");
const deleteFileAsync = (filePath, delayed = 3000, retryCount = 3) => {
    return new Promise((resolve, reject) => {
        const attemptDelete = (retries) => {
            setTimeout(() => {
                fs_1.default.unlink(filePath, (err) => {
                    if (err) {
                        if (err.code === "EPERM" && retries > 0) {
                            // Retry if EPERM error occurs
                            logger_1.default.warn(`Retrying delete for ${filePath}. Retries left: ${retries - 1}`);
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
const saveImage = (image, relativeSavePath, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { fieldname, filename, originalname, path: filePath } = image;
        // Rename to jpeg
        const fileNameWithoutExtension = filename.slice(0, filename.lastIndexOf("."));
        const newFileName = `${fileNameWithoutExtension}.jpeg`;
        const saveAbsolutePath = posix_1.default.join(utils_1.MEDIA_ROOT, relativeSavePath, newFileName);
        const saveRelativePath = posix_1.default.join(relativeSavePath, newFileName);
        // Ta avoid EPERM Error since sharp dont releaase file lock when passed path
        // Read the file mannually and parse the buffere
        const buffer = yield readFileAsync(filePath);
        yield (0, sharp_1.default)(buffer)
            .jpeg({ mozjpeg: true, quality: (_a = options === null || options === void 0 ? void 0 : options.quality) !== null && _a !== void 0 ? _a : 80 }) // Adjust quality
            .resize(options === null || options === void 0 ? void 0 : options.width, options === null || options === void 0 ? void 0 : options.height, { fit: options === null || options === void 0 ? void 0 : options.fit })
            .grayscale((_b = options === null || options === void 0 ? void 0 : options.isGrayScale) !== null && _b !== void 0 ? _b : false)
            .toFile(saveAbsolutePath);
        deleteFileAsync(filePath)
            .catch((er) => logger_1.default.error(`${er}`))
            .then((_) => logger_1.default.info(`Deleted sucesfully temporary file -> ${filePath}`)); //Delete temporary file in background
        return {
            absolute: saveAbsolutePath,
            relative: saveRelativePath,
        };
    }
    catch (error) {
        throw new exceprions_1.APIException(400, {
            [image.fieldname]: { _errors: [error.message] },
        });
    }
});
const fileUploader = {
    postUpload: (uploadPath) => {
        const storagePath = posix_1.default.join(utils_1.MEDIA_ROOT, uploadPath !== null && uploadPath !== void 0 ? uploadPath : "");
        (0, exports.ensureFolderExists)(storagePath);
        return {
            fields(fields) {
                return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    try {
                        const files = req.files;
                        if (!(0, lodash_1.isEmpty)(files)) {
                            for (const field of fields) {
                                const _mode = (_a = field.mode) !== null && _a !== void 0 ? _a : "array";
                                const fileList = (_b = files[field.name]) !== null && _b !== void 0 ? _b : [];
                                // TODO Add Rollbacks to handle early errors
                                // Assertain that if mode is single only one file is provded
                                if (_mode == "single" && fileList.length > 1)
                                    throw new exceprions_1.APIException(400, {
                                        [field.name]: {
                                            _errors: [
                                                `Espected single file for ${field.name} but received ${fileList.length}`,
                                            ],
                                        },
                                    });
                                // Process images and files if all test are passed
                                for (const file of fileList) {
                                    let _file;
                                    if (file.mimetype.split("/")[0] === "image") {
                                        _file = yield saveImage(file, uploadPath !== null && uploadPath !== void 0 ? uploadPath : "");
                                    }
                                    else {
                                        _file = yield saveFile(file, uploadPath !== null && uploadPath !== void 0 ? uploadPath : "");
                                    }
                                    if (_mode == "single") {
                                        req.body[field.name] = _file.relative;
                                    }
                                    else {
                                        //   Add file relative to request body
                                        req.body[field.name] = (_c = req.body[field.name]) !== null && _c !== void 0 ? _c : []; //Ensure field is initialized
                                        req.body[field.name].push(_file.relative);
                                    }
                                    //   Setup Roleback for uploaded files in queur
                                    (0, tasks_1.addRollBackTaskToQueue)(req, () => __awaiter(this, void 0, void 0, function* () {
                                        yield deleteFileAsync(_file.absolute);
                                        return `${_file.absolute} Rolled back successfully!`;
                                    }));
                                }
                            }
                        }
                        return next();
                    }
                    catch (error) {
                        return next(error);
                    }
                });
            },
        };
    },
    diskStorage,
};
exports.default = fileUploader;
