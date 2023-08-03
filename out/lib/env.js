"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.envSchema = void 0;
require("dotenv/config");
var zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    DISCORD_TOKEN: zod_1.z.string(),
    DISCORD_CLIENT_ID: zod_1.z.string(),
    CONOHA_USERNAME: zod_1.z.string(),
    CONOHA_PASSWORD: zod_1.z.string(),
    TENANT_ID: zod_1.z.string(),
    SERVER_ID: zod_1.z.string(),
});
exports.env = exports.envSchema.parse(process.env);
