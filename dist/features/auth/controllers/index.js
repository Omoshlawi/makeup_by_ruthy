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
exports.login = exports.register = void 0;
const schema_1 = require("../../../features/auth/schema");
const exceprions_1 = require("../../../shared/exceprions");
const models_1 = require("../../../features/users/models");
const lodash_1 = require("lodash");
const helpers_1 = require("../../../utils/helpers");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = yield schema_1.RegisterSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const { password, email, username, phoneNumber } = validation.data;
        const errors = {};
        if (yield models_1.UserModel.findFirst({ where: { username } }))
            errors["username"] = { _errors: ["User with username exist"] };
        if (yield models_1.UserModel.findFirst({ where: { profile: { email } } }))
            errors["email"] = { _errors: ["User with email exists"] };
        if (yield models_1.UserModel.findFirst({ where: { profile: { phoneNumber } } }))
            errors["phoneNumber"] = { _errors: ["User with phone number exist"] };
        if (!(0, lodash_1.isEmpty)(errors))
            throw { status: 400, errors };
        const user = yield models_1.UserModel.create({
            include: { profile: true },
            data: {
                username,
                password: yield (0, helpers_1.hashPassword)(password),
                profile: {
                    create: {
                        email,
                        phoneNumber,
                    },
                },
            },
        });
        const token = (0, helpers_1.generateUserToken)({ id: user.id });
        return res
            .setHeader("x-access-token", token)
            .setHeader("x-refresh-token", token)
            .json({ user, token });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = yield schema_1.LoginSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const { password, username } = validation.data;
        const users = yield models_1.UserModel.findMany({
            include: { profile: true },
            where: {
                OR: [
                    { username },
                    { profile: { email: username } },
                    { profile: { phoneNumber: username } },
                ],
                isActive: true,
            },
        });
        const passwordChecks = yield Promise.all(users.map((user) => (0, helpers_1.checkPassword)(user.password, password)));
        if (passwordChecks.every((val) => val === false))
            throw {
                status: 400,
                errors: {
                    username: { _errors: ["Invalid username or password"] },
                    password: { _errors: ["Invalid username or password"] },
                },
            };
        const user = users[passwordChecks.findIndex((val) => val)];
        const token = (0, helpers_1.generateUserToken)({ id: user.id });
        return res
            .setHeader("x-access-token", token)
            .setHeader("x-refresh-token", token)
            .json({ user, token });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
