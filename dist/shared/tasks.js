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
exports.executeRollBackTasks = exports.addRollBackTaskToQueue = void 0;
const logger_1 = __importDefault(require("./logger"));
function getRollBackTasks(req) {
    if (!req.rollBackTasks) {
        req.rollBackTasks = [];
    }
    return req.rollBackTasks;
}
const addRollBackTaskToQueue = (req, task) => __awaiter(void 0, void 0, void 0, function* () {
    const currTasks = getRollBackTasks(req);
    currTasks.push(task);
});
exports.addRollBackTaskToQueue = addRollBackTaskToQueue;
const executeRollBackTasks = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const currTasks = getRollBackTasks(req);
    const results = yield Promise.allSettled(currTasks.map((task) => task()));
    results.forEach((result, index) => {
        if (result.status === "rejected") {
            logger_1.default.error(`Rollback task ${index} failed:${result.reason}`);
        }
        else {
            logger_1.default.info(`${result.value}`);
        }
    });
});
exports.executeRollBackTasks = executeRollBackTasks;
