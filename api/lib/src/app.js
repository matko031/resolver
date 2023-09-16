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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const path = __importStar(require("path"));
const database_1 = __importDefault(require("./database"));
const environment_1 = __importDefault(require("./environment"));
console.log(path.join(__dirname, "services"));
console.log("hello");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(OpenApiValidator.middleware({
    apiSpec: './openapi/spec.yml',
    validateRequests: true,
    validateResponses: true,
    operationHandlers: path.join(__dirname, "services"),
}));
// sync/create db tables if development
if (environment_1.default.env == "development") {
    database_1.default.sync({ alter: true, match: /^dev/ });
}
exports.default = app;
//# sourceMappingURL=app.js.map