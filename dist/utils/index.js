"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessage = exports.isValidURL = exports.configuration = exports.PHONE_NUMBER_REGEX = exports.PROFILE_URL = exports.MEDIA_URL = exports.MEDIA_ROOT = exports.BASE_DIR = void 0;
const config_1 = __importDefault(require("config"));
const path_1 = __importDefault(require("path"));
exports.BASE_DIR = process.cwd();
exports.MEDIA_ROOT = path_1.default.join(exports.BASE_DIR, "media");
exports.MEDIA_URL = "media";
exports.PROFILE_URL = "uploads";
exports.PHONE_NUMBER_REGEX = /^(\+?254|0)((7|1)\d{8})$/;
exports.configuration = {
    version: require("./../../package.json").version,
    name: require("./../../package.json").name,
    db: config_1.default.get("db"),
    port: config_1.default.get("port"),
    jwt: config_1.default.get("jwt"),
    backend_url: config_1.default.get("backend_url"),
    mpesa: {
        debug: config_1.default.get("mpesa_debug") === "true",
        env: config_1.default.get("mpesa_env"),
        consumer_secrete: config_1.default.get("mpesa_consumer_secrete"),
        consumer_key: config_1.default.get("mpesa_consumer_key"),
        short_code: Number(config_1.default.get("mpesa_short_code")),
        initiator_password: config_1.default.get("mpesa_initiator_password"),
        pass_key: config_1.default.get("mpesa_pass_key"),
        account_ref: config_1.default.get("mpesa_account_ref"),
    },
};
var helpers_1 = require("../utils/helpers");
Object.defineProperty(exports, "isValidURL", { enumerable: true, get: function () { return helpers_1.isValidURL; } });
Object.defineProperty(exports, "parseMessage", { enumerable: true, get: function () { return helpers_1.parseMessage; } });
