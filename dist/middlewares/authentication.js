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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../features/users/models");
const utils_1 = require("../utils");
const jsonwebtoken_1 = require("jsonwebtoken");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("x-access-token");
    if (!token)
        return res.status(401).json({ detail: "Unauthorized - Token missing" });
    try {
        const { id } = (0, jsonwebtoken_1.verify)(token, utils_1.configuration.jwt);
        const user = yield models_1.UserModel.findUnique({
            where: { id },
            // include: { profile: true },
        });
        if (!user)
            throw new Error("");
        req.user = user;
        return next();
    }
    catch (err) {
        return res.status(401).json({ detail: "Unauthorized - Invalid token" });
    }
});
exports.default = authenticate;
