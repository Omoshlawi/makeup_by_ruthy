"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const db_1 = __importDefault(require("../services/db"));
const helpers_1 = require("../utils/helpers");
const readline = __importStar(require("readline"));
// Create an interface for readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Function to prompt a question and get the answer
const prompt = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};
const createSuperUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const username = yield prompt("Enter admin Username: ");
    if (yield db_1.default.user.findFirst({ where: { username } })) {
        console.log(`[x]User with username exists`);
        process.exit(-1);
    }
    const email = yield prompt("Enter admin email: ");
    if (yield db_1.default.user.findFirst({ where: { profile: { email } } })) {
        console.log(`[x]User with email exists`);
        process.exit(-1);
    }
    const phoneNumber = yield prompt("Enter admin phone number: ");
    if (yield db_1.default.user.findFirst({ where: { profile: { phoneNumber } } })) {
        console.log(`[x]User with phone number exist`);
        process.exit(-1);
    }
    const password = yield prompt("Enter admin password: ");
    const confirmPassword = yield prompt("Confirm admin password: ");
    if (password !== confirmPassword) {
        console.log(`[x]Passwords dint match`);
        process.exit(-1);
    }
    const user = yield db_1.default.user.create({
        include: { profile: true },
        data: {
            username,
            password: yield (0, helpers_1.hashPassword)(password),
            isAdmin: true,
            profile: {
                create: {
                    email,
                    phoneNumber,
                },
            },
        },
    });
    console.log("[*]Admin User created succesfully");
});
const deleteUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.user.deleteMany({
        where: {
            OR: [
                { username: username },
                { profile: { email: username } },
                { profile: { phoneNumber: username } },
            ],
        },
    });
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const args = process.argv.slice(2); // Slice to ignore the first two default arguments
    const comand = args[0] || ""; // First command-line argument (if any)
    if (comand === "createSuperUser") {
        yield createSuperUser();
    }
    else if (comand === "deleteUser") {
        if (args[1]) {
            yield deleteUser(args[1]);
            console.log("[*]User DEleted succesfully");
        }
        else {
            console.log("Required Unique user attribute");
        }
    }
    else {
        console.log("Invalid Command");
        console.log("Supported Commands");
        console.log("1. createSuperUser\n2. deleteUser");
    }
    process.exit(0);
});
main();
