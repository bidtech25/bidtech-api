"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiAnalysisProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAnalysisProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
let AiAnalysisProcessor = AiAnalysisProcessor_1 = class AiAnalysisProcessor {
    aiService;
    logger = new common_1.Logger(AiAnalysisProcessor_1.name);
    constructor(aiService) {
        this.aiService = aiService;
    }
    async handleAnalysis(job) {
        this.logger.log(`Processing AI analysis job ${job.id}`);
        try {
            const { processId, input, options } = job.data.payload;
            await job.progress(10);
            const result = await this.aiService.analyzeProcess(processId, input, options);
            await job.progress(100);
            return { success: true, result };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`AI analysis job ${job.id} failed:`, error.stack);
            }
            else {
                this.logger.error(`AI analysis job ${job.id} failed with unknown error`);
            }
            throw error;
        }
    }
};
exports.AiAnalysisProcessor = AiAnalysisProcessor;
__decorate([
    (0, bull_1.Process)('analyze'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAnalysisProcessor.prototype, "handleAnalysis", null);
exports.AiAnalysisProcessor = AiAnalysisProcessor = AiAnalysisProcessor_1 = __decorate([
    (0, bull_1.Processor)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiAnalysisProcessor);
//# sourceMappingURL=ai.processor.js.map