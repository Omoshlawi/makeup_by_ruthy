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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEnrollmentPayment = exports.triggerStkPush = void 0;
const exceprions_1 = require("../shared/exceprions");
const logger_1 = __importDefault(require("../shared/logger"));
const utils_1 = require("../utils");
const daraja_js_1 = require("daraja.js");
const triggerStkPush = (nomalizedPhoneNumber, amount, description) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calbackUrl = `${utils_1.configuration.backend_url}/mpesa/callback`;
        // Instantiate Mpesa
        const app = new daraja_js_1.Mpesa({
            debug: utils_1.configuration.mpesa.debug,
            consumerKey: utils_1.configuration.mpesa.consumer_key,
            consumerSecret: utils_1.configuration.mpesa.consumer_secrete,
            organizationShortCode: utils_1.configuration.mpesa.short_code,
            initiatorPassword: utils_1.configuration.mpesa.initiator_password,
        }, utils_1.configuration.mpesa.env);
        // Trigger stk push
        const response = yield app
            .stkPush()
            .phoneNumber(Number(`254${nomalizedPhoneNumber}`))
            .amount(amount)
            .accountNumber(utils_1.configuration.mpesa.account_ref)
            .lipaNaMpesaPassKey(utils_1.configuration.mpesa.pass_key)
            .paymentType("CustomerBuyGoodsOnline")
            .callbackURL(calbackUrl)
            .description(description)
            .send();
        return response;
    }
    catch (e) {
        logger_1.default.error(`Error initating stk push${e.message}`);
        throw new exceprions_1.APIException(500, { detail: e.message });
    }
});
exports.triggerStkPush = triggerStkPush;
const makeEnrollmentPayment = (enrollment) => __awaiter(void 0, void 0, void 0, function* () { });
exports.makeEnrollmentPayment = makeEnrollmentPayment;
