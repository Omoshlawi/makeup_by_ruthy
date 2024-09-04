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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const server_1 = require("./server");
const logger_1 = __importDefault(require("./shared/logger"));
const utils_1 = require("./utils");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    //-------------- connect to database---------------------
    yield (0, server_1.dbConnection)();
    //-------------- end database connecivity      ---------------------
    // -----------------Message broker--------------------------
    // -----------------End Message broker---------------------
    yield (0, server_1.configureExpressApp)(app);
    const port = (_a = utils_1.configuration.port) !== null && _a !== void 0 ? _a : 0;
    httpServer.listen(port, () => {
        logger_1.default.info("App listening in port port: " + port + "....");
    });
});
startServer();
