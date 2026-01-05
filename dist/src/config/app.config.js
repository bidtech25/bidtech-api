"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT ?? '3000', 10),
    logLevel: process.env.LOG_LEVEL,
    openaiApiKey: process.env.OPENAI_API_KEY,
}));
//# sourceMappingURL=app.config.js.map