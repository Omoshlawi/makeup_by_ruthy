"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mpesa_1 = require("../controllers/mpesa");
const router = (0, express_1.Router)();
router.post("/callback", mpesa_1.mpesaCallback);
exports.default = router;
