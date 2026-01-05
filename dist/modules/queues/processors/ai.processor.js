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
var AiProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
let AiProcessor = AiProcessor_1 = class AiProcessor {
    logger = new common_1.Logger(AiProcessor_1.name);
    async handleAiAnalysis(job) {
        this.logger.log(`Processing AI analysis job ${job.id}`);
        try {
            const { processId } = job.data.payload;
            await job.progress(10);
            await job.progress(100);
            return { success: true, processId };
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
    onActive(job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
    }
    onCompleted(job, result) {
        this.logger.log(`Job ${job.id} completed with result: ${JSON.stringify(result)}`);
    }
    onFailed(job, err) {
        this.logger.error(`Job ${job.id} failed with error: ${err.message}`);
    }
};
exports.AiProcessor = AiProcessor;
__decorate([
    (0, bull_1.Process)('analyze'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiProcessor.prototype, "handleAiAnalysis", null);
__decorate([
    (0, bull_1.OnQueueActive)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiProcessor.prototype, "onActive", null);
__decorate([
    (0, bull_1.OnQueueCompleted)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AiProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], AiProcessor.prototype, "onFailed", null);
exports.AiProcessor = AiProcessor = AiProcessor_1 = __decorate([
    (0, bull_1.Processor)('ai')
], AiProcessor);
//# sourceMappingURL=ai.processor.js.map