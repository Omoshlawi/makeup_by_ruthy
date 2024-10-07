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
exports.normalizeIp = exports.checkPassword = exports.generateUserToken = exports.hashPassword = void 0;
exports.parseMessage = parseMessage;
exports.isValidURL = isValidURL;
exports.normalizePhoneNumber = normalizePhoneNumber;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _1 = require(".");
function parseMessage(object, template) {
    // regular expression to match placeholders like {{field}}
    const placeholderRegex = /{{(.*?)}}/g;
    // Use a replace function to replace placeholders with corresponding values
    const parsedMessage = template.replace(placeholderRegex, (match, fieldName) => {
        // The fieldName variable contains the field name inside the placeholder
        // Check if the field exists in the event object
        if (object.hasOwnProperty(fieldName)) {
            return object[fieldName]; // Replace with the field's value
        }
        else {
            // Placeholder not found in event, leave it unchanged
            return match;
        }
    });
    return parsedMessage;
}
function isValidURL(url) {
    try {
        // Attempt to create a URL object
        new URL(url);
        return true;
    }
    catch (error) {
        return false;
    }
}
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    const hash = yield bcrypt_1.default.hash(password, salt);
    return hash;
});
exports.hashPassword = hashPassword;
const generateUserToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, _1.configuration.jwt);
    return token;
};
exports.generateUserToken = generateUserToken;
const checkPassword = (hash, password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hash);
});
exports.checkPassword = checkPassword;
function normalizePhoneNumber(phoneNumber) {
    // Define the regex pattern to capture the phone number part
    const kenyanPhoneNumberRegex = /^(\+?254|0)?((7|1)\d{8})$/;
    // Match the phone number against the regex
    const match = phoneNumber.match(kenyanPhoneNumberRegex);
    // If there's a match, return the captured group; otherwise, return null or throw an error
    if (match) {
        return match[2]; // The second capturing group contains the desired phone number part
    }
    else {
        throw new Error("Invalid Kenyan phone number format");
    }
}
const normalizeIp = (ip) => {
    // Normalize IPv6 localhost address
    if (ip === "::1") {
        return "127.0.0.1";
    }
    // Strip IPv6 prefix for IPv4 addresses
    if (ip.startsWith("::ffff:")) {
        return ip.replace("::ffff:", "");
    }
    return ip;
};
exports.normalizeIp = normalizeIp;
