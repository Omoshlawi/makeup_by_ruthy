"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_1 = require("../controllers/reviews");
const validators_1 = require("../../../middlewares/validators");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", reviews_1.postReview);
router.put("/:reviewId", (0, validators_1.validateUUIDPathParam)("reviewId"), reviews_1.updateReview);
exports.default = router;
