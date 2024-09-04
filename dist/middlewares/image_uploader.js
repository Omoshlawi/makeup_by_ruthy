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
const filter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] !== "image") {
        cb(new exceprions_1.APIException(400, {
            _errors: ["Only image files are allowed"],
        }));
    }
    else {
        cb(null, true);
    }
};
const memoryImage = () => {
    const storage = multer_1.default.memoryStorage();
    return (0, multer_1.default)({ storage, fileFilter: filter });
};
const filesToPathArray = (files, uploadPath) => {
    var _a;
    return Array.from((_a = files) !== null && _a !== void 0 ? _a : []).map(({ filename, originalname }) => posix_1.default.join(uploadPath, filename !== null && filename !== void 0 ? filename : originalname));
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
const generateFilePath = (filePath) => {
    const fileNameWithoutExtension = filePath.slice(0, filePath.lastIndexOf("."));
    const newPath = `${fileNameWithoutExtension}.jpeg`;
    const fileName = posix_1.default.basename(newPath);
    const dirName = posix_1.default.dirname(newPath);
    return posix_1.default.join(dirName, (0, exports.renameFile)(fileName));
};
const saveImages = (files, savePathRelative, options) => __awaiter(void 0, void 0, void 0, function* () {
    const filePaths = filesToPathArray(files, savePathRelative).map(generateFilePath);
    const uploadTasks = (0, lodash_1.zip)(filePaths, files).map(([path_, file]) => {
        var _a, _b;
        return (0, sharp_1.default)(file.buffer)
            .jpeg({ mozjpeg: true, quality: (_a = options === null || options === void 0 ? void 0 : options.quality) !== null && _a !== void 0 ? _a : 80 }) // Adjust quality
            .resize(options === null || options === void 0 ? void 0 : options.width, options === null || options === void 0 ? void 0 : options.height, { fit: options === null || options === void 0 ? void 0 : options.fit })
            .grayscale((_b = options === null || options === void 0 ? void 0 : options.isGrayScale) !== null && _b !== void 0 ? _b : false)
            .toFile(posix_1.default.join(utils_1.MEDIA_ROOT, path_));
    });
    const saved = yield Promise.all(uploadTasks);
    return saved.map((outputInfo, index) => ({
        outputInfo,
        relative: filePaths[index],
        absolute: posix_1.default.join(utils_1.MEDIA_ROOT, filePaths[index]),
    }));
});
const sanitizeFilename = (filename) => filename.replace(/[^\w\s.-]/gi, "");
const deleteFileAsync = (filePath) => new Promise((resolve, reject) => {
    fs_1.default.unlink(filePath, (err) => {
        if (err)
            return reject(err);
        return resolve();
    });
});
const rollBackFileUploads = (absolutePaths) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(absolutePaths.map(deleteFileAsync));
});
const imageUploader = {
    postImageUpload: (uploadPath) => {
        // Ensure folder exist
        (0, exports.ensureFolderExists)(posix_1.default.join(utils_1.MEDIA_ROOT, uploadPath !== null && uploadPath !== void 0 ? uploadPath : ""));
        return {
            single(fieldName) {
                return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (req.file) {
                            const uploaded = yield saveImages([req.file], uploadPath !== null && uploadPath !== void 0 ? uploadPath : "");
                            req.body[fieldName] = uploaded[0].relative;
                            (0, tasks_1.addRollBackTaskToQueue)(req, () => __awaiter(this, void 0, void 0, function* () {
                                yield rollBackFileUploads([uploaded[0].absolute]);
                                return `[+]Files ${uploaded[0].absolute} rolled back suceesfully`;
                            }));
                        }
                        else {
                            // For update operations acceppt path of the image for non updated files only require files hence set to udefined
                            // TODO Can perfome image path validation in the controller
                            if (["PUT", "PATCH"].includes(req.method)) {
                            }
                            else
                                req.body[fieldName] = undefined;
                        }
                        return next();
                    }
                    catch (error) {
                        return next(error);
                    }
                });
            },
            array(fieldName) {
                return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    try {
                        if (((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            const uploaded = yield saveImages(req.files, uploadPath !== null && uploadPath !== void 0 ? uploadPath : "");
                            req.body[fieldName] = uploaded.map((o) => o.relative);
                        }
                        else {
                            req.body[fieldName] = [];
                        }
                        return next();
                    }
                    catch (error) {
                        return next(error);
                    }
                });
            },
            fields(fields) {
                return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const files = req.files;
                        if (!(0, lodash_1.isEmpty)(files)) {
                            for (const field of fields) {
                                const uploaded = yield saveImages(files[field.name], uploadPath !== null && uploadPath !== void 0 ? uploadPath : "");
                                req.body[field.name] = uploaded.map((o) => o.relative);
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
    memoryImage,
};
exports.default = imageUploader;
