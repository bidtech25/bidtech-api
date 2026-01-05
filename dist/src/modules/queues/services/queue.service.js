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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const uuid_1 = require("uuid");
let QueueService = class QueueService {
    aiQueue;
    bpmnQueue;
    constructor(aiQueue, bpmnQueue) {
        this.aiQueue = aiQueue;
        this.bpmnQueue = bpmnQueue;
    }
    async addAiAnalysis(payload, userId, options) {
        const jobData = {
            id: (0, uuid_1.v4)(),
            userId,
            payload,
            createdAt: new Date(),
        };
        const job = await this.aiQueue.add('analyze', jobData, options);
        return job.id.toString();
    }
    async addBpmnGeneration(payload, userId, options) {
        const jobData = {
            id: (0, uuid_1.v4)(),
            userId,
            payload,
            createdAt: new Date(),
        };
        const job = await this.bpmnQueue.add('generate', jobData, options);
        return job.id.toString();
    }
    async getJobStatus(queueName, jobId) {
        const queue = queueName === 'ai' ? this.aiQueue : this.bpmnQueue;
        const job = await queue.getJob(jobId);
        if (!job)
            return null;
        return {
            id: job.id,
            state: await job.getState(),
            progress: job.progress(),
            failedReason: job.failedReason,
            finishedOn: job.finishedOn,
        };
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('ai')),
    __param(1, (0, bull_1.InjectQueue)('bpmn')),
    __metadata("design:paramtypes", [Object, Object])
], QueueService);
//# sourceMappingURL=queue.service.js.map