"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = __importDefault(require("../../../middlewares/authentication"));
const express_1 = require("express");
const controllers_1 = require("../controllers");
const image_uploader_1 = __importDefault(require("../../../middlewares/image_uploader"));
const middlewares_1 = require("../../../middlewares");
const require_roles_1 = require("../../../middlewares/require_roles");
const router = (0, express_1.Router)();
router.put("/profile", authentication_1.default, controllers_1.updateProfile);
router.get("/profile", authentication_1.default, controllers_1.viewProfile);
router.put("/account-set-up", [
    authentication_1.default,
    image_uploader_1.default.memoryImage().single("avatarUrl"),
    image_uploader_1.default.postImageUpload("user/avatar").single("avatarUrl"),
], controllers_1.setUpAccount);
router.get("/", [middlewares_1.requireAuthenticated, require_roles_1.requireAdmin], controllers_1.getUsers);
router.get("/:userId/actions/:action", [middlewares_1.requireAuthenticated, require_roles_1.requireAdmin], controllers_1.perfomUserAction);
exports.default = router;
