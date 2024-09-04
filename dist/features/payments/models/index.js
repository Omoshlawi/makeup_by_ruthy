"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const db_1 = __importDefault(require("../../../services/db"));
exports.PaymentModel = db_1.default.payment;
