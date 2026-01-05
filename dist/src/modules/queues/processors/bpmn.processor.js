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
var BpmnProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpmnProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const bpmn_service_1 = require("../../bpmn/bpmn.service");
let BpmnProcessor = BpmnProcessor_1 = class BpmnProcessor {
    bpmnService;
    logger = new common_1.Logger(BpmnProcessor_1.name);
    constructor(bpmnService) {
        this.bpmnService = bpmnService;
    }
    async handleBpmnGeneration(job) {
        this.logger.log(`Processing BPMN generation job ${job.id}`);
        try {
            const { processId, format, svg } = job.data.payload;
            await job.progress(10);
            let result = null;
            if (format === 'png' && svg) {
                const buffer = await this.bpmnService.svgToPng(svg);
                if (buffer) {
                    result = buffer.toString('base64');
                }
                else {
                    this.logger.warn('Puppeteer service unavailable. Cannot convert SVG to PNG.');
                }
            }
            await job.progress(100);
            return { success: true, processId, format, result: result ? 'Base64 Image Generated' : 'No SVG provided' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`BPMN generation job ${job.id} failed:`, error.stack);
            }
            else {
                this.logger.error(`BPMN generation job ${job.id} failed with unknown error`);
            }
            throw error;
        }
    }
};
exports.BpmnProcessor = BpmnProcessor;
__decorate([
    (0, bull_1.Process)('generate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BpmnProcessor.prototype, "handleBpmnGeneration", null);
exports.BpmnProcessor = BpmnProcessor = BpmnProcessor_1 = __decorate([
    (0, bull_1.Processor)('bpmn'),
    __metadata("design:paramtypes", [bpmn_service_1.BpmnService])
], BpmnProcessor);
//# sourceMappingURL=bpmn.processor.js.map