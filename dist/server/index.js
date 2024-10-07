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
exports.configureExpressApp = exports.dbConnection = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const utils_1 = require("../utils");
const middlewares_1 = require("../middlewares");
const logger_1 = __importDefault(require("../shared/logger"));
const routes_1 = __importDefault(require("../features/users/routes"));
const routes_2 = __importDefault(require("../features/auth/routes"));
const routes_3 = __importDefault(require("../features/courses/routes"));
const routes_4 = __importDefault(require("../features/instructors/routes"));
const routes_5 = __importDefault(require("../features/students/routes"));
const routes_6 = __importDefault(require("../features/payments/routes"));
const routes_7 = __importDefault(require("../features/admin/routes"));
/**
 * Handle database connection logic
 */
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to database here
    }
    catch (error) {
        logger_1.default.error("[x]Could not connect to database" + error);
        process.exit(1); // Exit the application on database connection error
    }
});
exports.dbConnection = dbConnection;
const configureExpressApp = (app) => __awaiter(void 0, void 0, void 0, function* () {
    // --------------------middlewares---------------------------
    if (app.get("env") === "development") {
        app.use((0, morgan_1.default)("tiny"));
        logger_1.default.info(`[+]${utils_1.configuration.name}:${utils_1.configuration.version} enable morgan`);
    }
    app.use((0, cors_1.default)());
    app.use(express_1.default.static(utils_1.MEDIA_ROOT));
    // Make sure to use these body parsers so Auth.js can receive data from the client
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // ------------------End middlewares------------------------
    //------------------- routes --------------------------------
    // Add routes here
    app.use("/users", routes_1.default);
    app.use("/auth", routes_2.default);
    app.use("/courses", routes_3.default);
    app.use("/instructors", routes_4.default);
    app.use("/students", routes_5.default);
    app.use("/payments", routes_6.default);
    app.use("/admin", routes_7.default);
    //-------------------end routes-----------------------------
    //---------------- error handler -----------------------
    app.use(middlewares_1.handleErrors);
    app.use((req, res) => {
        res.status(404).json({ detail: "Not Found" });
    });
    //---------------- end error handler -----------------------
});
exports.configureExpressApp = configureExpressApp;
