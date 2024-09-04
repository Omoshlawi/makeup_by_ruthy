"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameFile = exports.ensureFolderExists = void 0;
const slugify_1 = __importDefault(require("slugify"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
const exceprions_1 = require("../shared/exceprions");
const ensureFolderExists = (folderPath) => {
    if (!fs_1.default.existsSync(folderPath)) {
        fs_1.default.mkdirSync(folderPath, { recursive: true });
    }
};
exports.ensureFolderExists = ensureFolderExists;
const filter = (req, file, cb) => {
    if (req.query.fileType === "image" &&
        file.mimetype.split("/")[0] !== "image") {
        cb(new exceprions_1.APIException(400, {
            [req.body.fieldName]: {
                _errors: ["Only images are allowed"],
            },
        }));
    }
    else {
        cb(null, true);
    }
};
const renameFile = (fileName) => (0, slugify_1.default)(utils_1.configuration.name) +
    "-" +
    (0, slugify_1.default)(utils_1.configuration.version) +
    "-" +
    Date.now() +
    "-" +
    (0, slugify_1.default)(fileName, { lower: true, trim: true });
exports.renameFile = renameFile;
const diskFile = ({ dest }) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const destinationFolder = path_1.default.join(utils_1.MEDIA_ROOT, dest);
            (0, exports.ensureFolderExists)(destinationFolder);
            cb(null, destinationFolder);
        },
        filename: (req, file, cb) => {
            cb(null, (0, exports.renameFile)(file.originalname));
        },
    });
    return (0, multer_1.default)({ storage, fileFilter: filter });
};
// const uploads = multer({ dest: "../media/uploads" });
const memoryFile = () => {
    const storage = multer_1.default.memoryStorage();
    return (0, multer_1.default)({ storage, fileFilter: filter });
};
const uploader = {
    diskFile,
    memoryFile,
};
exports.default = uploader;
