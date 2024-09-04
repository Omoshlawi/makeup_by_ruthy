"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const content_1 = require("../controllers/content");
const validators_1 = require("../../../middlewares/validators");
const file_uploader_1 = __importDefault(require("../../../middlewares/file_uploader"));
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", [
    file_uploader_1.default
        .diskStorage("draft")
        .fields([{ name: "resource", maxCount: 1 }]),
    file_uploader_1.default
        .postUpload("courses")
        .fields([{ name: "resource", maxCount: 1, mode: "single" }]),
], content_1.addModuleContent);
router.put("/:id", [
    (0, validators_1.validateUUIDPathParam)("id"),
    file_uploader_1.default
        .diskStorage("draft")
        .fields([{ name: "resource", maxCount: 1 }]),
    file_uploader_1.default
        .postUpload("courses")
        .fields([{ name: "resource", maxCount: 1, mode: "single" }]),
], content_1.updateModuleContent);
router.delete("/:id", (0, validators_1.validateUUIDPathParam)("id"), content_1.deleteModuleContent);
exports.default = router;
