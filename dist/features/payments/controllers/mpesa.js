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
exports.mpesaCallback = void 0;
const models_1 = require("../models");
const mpesaCallback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("-------------------Ip address", req.ip || req.socket.remoteAddress || req.connection.remoteAddress);
        const { Body: { stkCallback: { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata: { Item }, }, }, } = req.body;
        const data = Item.reduce((prev, curr) => {
            if (curr.Name === "Amount")
                return Object.assign(Object.assign({}, prev), { amount: curr.Value });
            else if (curr.Name === "MpesaReceiptNumber")
                return Object.assign(Object.assign({}, prev), { mpesareceiptNumber: curr.Value });
            else if (curr.Name === "TransactionDate")
                return Object.assign(Object.assign({}, prev), { transactionDate: `${curr.Value}` });
            else if (curr.Name === "PhoneNumber")
                return Object.assign(Object.assign({}, prev), { phoneNumber: `${curr.Value}` });
            else
                return prev;
        }, {});
        const payload = Object.assign({ merchantRequestId: MerchantRequestID, checkoutRequestId: CheckoutRequestID, resultCode: String(ResultCode), resultDescription: ResultDesc }, data);
        let payment = yield models_1.PaymentModel.update({
            where: {
                merchantRequestId: payload.merchantRequestId,
                checkoutRequestId: payload.checkoutRequestId,
            },
            data: Object.assign({ complete: true }, payload),
        });
        return res.json(payment);
    }
    catch (error) {
        next(error);
    }
});
exports.mpesaCallback = mpesaCallback;
