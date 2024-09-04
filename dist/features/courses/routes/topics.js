"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topics_1 = require("../controllers/topics");
const validators_1 = require("../../../middlewares/validators");
const image_uploader_1 = __importDefault(require("../../../middlewares/image_uploader"));
const router = (0, express_1.Router)();
router.get("/", topics_1.getTopics);
router.post("/", [
    image_uploader_1.default.memoryImage().single("thumbnail"),
    image_uploader_1.default.postImageUpload("courses/topics").single("thumbnail"),
], topics_1.addTopic);
router.get("/:id", [(0, validators_1.validateUUIDPathParam)("id")], topics_1.getTopic);
router.put("/:id", [
    (0, validators_1.validateUUIDPathParam)("id"),
    image_uploader_1.default.memoryImage().single("thumbnail"),
    image_uploader_1.default.postImageUpload("courses/topics").single("thumbnail"),
], topics_1.updateTopic);
router.delete("/:id", [(0, validators_1.validateUUIDPathParam)("id")], topics_1.deleteTopic);
exports.default = router;
