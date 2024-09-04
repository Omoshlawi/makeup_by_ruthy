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
exports.getInstructors = void 0;
const models_1 = require("../../../features/users/models");
const schema_1 = require("../schema");
const exceprions_1 = require("../../../shared/exceprions");
const helpers_1 = require("../../../utils/helpers");
const getInstructors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = yield schema_1.instructorSearchSchema.safeParseAsync(req.query);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        console.log("[+]Log instructors", validation.data);
        const { search, page, pageSize, rating } = validation.data;
        const instructors = yield models_1.UserModel.findMany({
            where: {
                AND: [
                    { profile: { instructor: { isNot: null } } },
                    {
                        profile: {
                            instructor: {
                                courses: {
                                    some: {
                                        averageRating: {
                                            gte: rating,
                                            lt: rating ? rating + 1 : undefined,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    {
                        OR: search
                            ? [
                                {
                                    username: {
                                        contains: search,
                                    },
                                },
                                {
                                    profile: {
                                        name: {
                                            contains: search,
                                        },
                                    },
                                },
                            ]
                            : undefined,
                    },
                ],
            },
            skip: (0, helpers_1.paginate)(pageSize, page),
            take: pageSize,
            orderBy: { createdAt: "asc" },
            include: {
                profile: {
                    include: {
                        instructor: {
                            include: {
                                specialities: { include: { topic: true } },
                                courses: true,
                            },
                        },
                    },
                },
            },
        });
        return res.json({ results: instructors });
    }
    catch (error) {
        next(error);
    }
});
exports.getInstructors = getInstructors;
