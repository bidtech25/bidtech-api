import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private prisma;
    private config;
    private readonly logger;
    private readonly openai;
    private readonly maxTokens;
    constructor(prisma: PrismaService, config: ConfigService);
    analyzeProcess(processId: string, input: string, options?: {
        model?: string;
        temperature?: number;
    }, attempt?: number): Promise<any>;
    private getRetryAfter;
    private sleep;
    private parseAnalysis;
}
