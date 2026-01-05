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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let AiService = AiService_1 = class AiService {
    prisma;
    config;
    logger = new common_1.Logger(AiService_1.name);
    openai;
    maxTokens = 4000;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.openai = new openai_1.default({
            apiKey: this.config.get('OPENAI_API_KEY'),
            timeout: 60000,
            maxRetries: 0,
        });
    }
    async analyzeProcess(processId, input, options, attempt = 1) {
        this.logger.log(`Analyzing process ${processId} (attempt ${attempt})`);
        try {
            const completion = await this.openai.chat.completions.create({
                model: options?.model || 'gpt-4o-mini',
                temperature: options?.temperature || 0.7,
                max_tokens: this.maxTokens,
                messages: [
                    {
                        role: 'system',
                        content: `Você é um especialista em mapeamento de processos e análise de negócios.
Analise o processo descrito e retorne um JSON estruturado com:
- analysis: string (análise geral)
- suggestions: string[] (sugestões de melhoria)
- risks: string[] (riscos identificados)
- improvements: string[] (oportunidades de otimização)`,
                    },
                    {
                        role: 'user',
                        content: input,
                    },
                ],
            });
            const rawContent = completion.choices[0].message.content;
            const result = this.parseAnalysis(rawContent);
            await this.prisma.aiInsight.create({
                data: {
                    process: { connect: { id: processId } },
                    status: 'completed',
                    result,
                },
            });
            this.logger.log(`Analysis completed for process ${processId}`);
            return result;
        }
        catch (error) {
            if (error && error.status === 429 && attempt < 3) {
                const retryAfter = this.getRetryAfter(error);
                this.logger.warn(`Rate limit hit for process ${processId}. Retrying after ${retryAfter}ms`);
                await this.sleep(retryAfter);
                return this.analyzeProcess(processId, input, options, attempt + 1);
            }
            await this.prisma.aiInsight.create({
                data: {
                    process: { connect: { id: processId } },
                    status: 'failed',
                    result: { error: error.message || 'Unknown error' },
                },
            });
            this.logger.error(`Analysis failed for process ${processId}:`, error);
            throw error;
        }
    }
    getRetryAfter(error) {
        if (error.headers && error.headers['retry-after']) {
            const retryAfter = parseInt(error.headers['retry-after'], 10);
            return retryAfter * 1000;
        }
        return Math.min(5000 * Math.pow(2, error.attempt || 0), 30000);
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    parseAnalysis(rawText) {
        if (!rawText)
            return { analysis: '', suggestions: [], risks: [], improvements: [] };
        try {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return {
                analysis: rawText,
                suggestions: [],
                risks: [],
                improvements: [],
            };
        }
        catch (error) {
            this.logger.warn('Failed to parse AI response as JSON, using raw text');
            return {
                analysis: rawText,
                suggestions: [],
                risks: [],
                improvements: [],
            };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map