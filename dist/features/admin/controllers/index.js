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
exports.getModelsAggregates = void 0;
const models_1 = require("../../../features/courses/models");
const models_2 = require("../../../features/instructors/models");
const models_3 = require("../../../features/students/models");
const models_4 = require("../../../features/users/models");
const getModelsAggregates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.json({
            topics: yield models_1.TopicsMddel.count(),
            courses: {
                all: yield models_1.CourseModel.count(),
                draft: yield models_1.CourseModel.count({ where: { status: "Draft" } }),
                approved: yield models_1.CourseModel.count({ where: { approved: true } }),
                pendingApproval: yield models_1.CourseModel.count({
                    where: { approved: false },
                }),
                published: yield models_1.CourseModel.count({ where: { status: "Published" } }),
            },
            users: {
                all: yield models_4.UserModel.count(),
                students: yield models_3.StudentsModel.count(),
                instructors: yield models_2.InstructorModel.count(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getModelsAggregates = getModelsAggregates;
