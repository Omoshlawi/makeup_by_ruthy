"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIException = void 0;
class APIException extends Error {
    constructor(status, errors) {
        super("API Exception");
        this.status = status;
        this.errors = errors;
    }
}
exports.APIException = APIException;
