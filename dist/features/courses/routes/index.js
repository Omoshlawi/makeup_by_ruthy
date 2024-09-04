"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topics_1 = __importDefault(require("./topics"));
const courses_1 = __importDefault(require("./courses"));
const router = (0, express_1.Router)();
router.use("/topics", topics_1.default);
router.use("/", courses_1.default);
exports.default = router;
