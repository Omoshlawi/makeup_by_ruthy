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
exports.setUpAccount = exports.getUsers = exports.viewProfile = exports.updateProfile = void 0;
const schema_1 = require("../schema");
const exceprions_1 = require("../../../shared/exceprions");
const models_1 = require("../models");
const lodash_1 = require("lodash");
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const validation = await ProfileSchema.safeParseAsync(req.body);
        // if (!validation.success)
        //   throw new APIException(400, validation.error.format());
        // const { gender, name, email, username, phoneNumber } = validation.data;
        // const _user = (req as any).user;
        // const errors: any = {};
        // if (
        //   await UserModel.findFirst({ where: { username, id: { not: _user.id } } })
        // )
        //   errors["username"] = { _errors: ["User with username exist"] };
        // if (await UserModel.findFirst({ where: { email, id: { not: _user.id } } }))
        //   errors["email"] = { _errors: ["User with email exist"] };
        // if (
        //   await UserModel.findFirst({
        //     where: { phoneNumber, id: { not: _user.id } },
        //   })
        // )
        //   errors["phoneNumber"] = { _errors: ["User with phone number exist"] };
        // if (!isEmpty(errors)) throw { status: 400, errors };
        // const user = await UserModel.update({
        //   where: { id: _user.id },
        //   data: {
        //     // email,
        //     // phoneNumber,
        //     username,
        //     // gender,
        //     name,
        //   },
        // });
        // return res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.updateProfile = updateProfile;
const viewProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.json(yield models_1.UserModel.findUnique({
            where: { id: req.user.id },
            include: {
                profile: {
                    include: {
                        instructor: { include: { specialities: true } },
                        student: { include: { areasOfInterest: true } },
                    },
                },
            },
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.viewProfile = viewProfile;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.json({ results: yield models_1.UserModel.findMany() });
    }
    catch (error) {
        return next(error);
    }
});
exports.getUsers = getUsers;
const setUpAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatopn = yield schema_1.accountSetupSchema.safeParseAsync(req.body);
        if (!validatopn.success)
            throw new exceprions_1.APIException(400, validatopn.error.format());
        const user = req.user;
        const { username, email, phoneNumber, bio, areasOfInterest, avatarUrl, experience, gender, name, skillLevel, specialities, userType, facebook, instagram, linkedin, tiktok, twitter, youtube, } = validatopn.data;
        const errors = {};
        if (yield models_1.UserModel.findFirst({ where: { username, id: { not: user.id } } }))
            errors["username"] = { _errors: ["Username taken"] };
        if (yield models_1.UserModel.findFirst({
            where: { profile: { email }, id: { not: user.id } },
        }))
            errors["email"] = { _errors: ["Email taken"] };
        if (yield models_1.UserModel.findFirst({
            where: { profile: { phoneNumber }, id: { not: user.id } },
        }))
            errors["phoneNumber"] = { _errors: ["Phone number taken"] };
        if (!(0, lodash_1.isEmpty)(errors))
            throw new exceprions_1.APIException(400, errors);
        const updated = yield models_1.UserModel.update({
            where: { id: user.id },
            include: { profile: { include: { instructor: true, student: true } } },
            data: {
                profileUpdated: true,
                username,
                profile: {
                    update: {
                        avatarUrl,
                        bio,
                        email,
                        phoneNumber,
                        name,
                        socialLinks: {
                            facebook,
                            instagram,
                            linkedin,
                            tiktok,
                            twitter,
                            youtube,
                        },
                        gender,
                        instructor: userType === "Instructor"
                            ? {
                                upsert: {
                                    create: {
                                        experience: experience,
                                        specialities: {
                                            createMany: {
                                                skipDuplicates: true,
                                                data: specialities.map((s) => ({ topicId: s })),
                                            },
                                        },
                                    },
                                    update: {
                                        experience,
                                        specialities: {
                                            createMany: {
                                                skipDuplicates: true,
                                                data: specialities.map((e) => ({ topicId: e })),
                                            },
                                        },
                                    },
                                },
                            }
                            : undefined,
                        student: userType === "Student"
                            ? {
                                upsert: {
                                    create: {
                                        skillLevel: skillLevel,
                                        areasOfInterest: {
                                            createMany: {
                                                skipDuplicates: true,
                                                data: areasOfInterest.map((a) => ({ topicId: a })),
                                            },
                                        },
                                    },
                                    update: {
                                        skillLevel,
                                        areasOfInterest: {
                                            createMany: {
                                                skipDuplicates: true,
                                                data: areasOfInterest.map((a) => ({ topicId: a })),
                                            },
                                        },
                                    },
                                },
                            }
                            : undefined,
                    },
                },
            },
        });
        return res.json(updated);
    }
    catch (error) {
        return next(error);
    }
});
exports.setUpAccount = setUpAccount;
