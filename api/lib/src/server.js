"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const environment_1 = __importDefault(require("./environment"));
// create server
const server = (0, http_1.createServer)(app_1.default);
// Start the server
server.listen(environment_1.default.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${environment_1.default.port}`);
});
exports.default = server;
//# sourceMappingURL=server.js.map