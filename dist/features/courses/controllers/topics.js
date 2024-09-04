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
exports.deleteTopic = exports.updateTopic = exports.addTopic = exports.getTopic = exports.getTopics = void 0;
const models_1 = require("../models");
const schema_1 = require("../schema");
const exceprions_1 = require("../../../shared/exceprions");
const getTopics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield models_1.TopicsMddel.findMany();
        return res.json({ results: topics });
    }
    catch (error) {
        next(error);
    }
});
exports.getTopics = getTopics;
const getTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield models_1.TopicsMddel.findUniqueOrThrow({
            where: { id: req.params.id },
        });
        return res.json({ results: topics });
    }
    catch (error) {
        next(error);
    }
});
exports.getTopic = getTopic;
const addTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = yield schema_1.topicValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const topic = yield models_1.TopicsMddel.create({ data: validation.data });
        return res.json(topic);
    }
    catch (error) {
        next(error);
    }
});
exports.addTopic = addTopic;
const updateTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = yield schema_1.topicValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const topic = yield models_1.TopicsMddel.update({
            data: validation.data,
            where: { id: req.params.id },
        });
        return res.json(topic);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTopic = updateTopic;
const deleteTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield models_1.TopicsMddel.delete({
            where: { id: req.params.id },
        });
        return res.json(topic);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTopic = deleteTopic;
