import type { Job } from 'bull';
import { AiService } from './ai.service';
import { QueueJobData } from '@/modules/queues/services/queue.service';
export declare class AiAnalysisProcessor {
    private aiService;
    private readonly logger;
    constructor(aiService: AiService);
    handleAnalysis(job: Job<QueueJobData>): Promise<{
        success: boolean;
        result: any;
    }>;
}
