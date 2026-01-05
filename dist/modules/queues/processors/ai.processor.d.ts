import type { Job } from 'bull';
import { QueueJobData } from '../services/queue.service';
export declare class AiProcessor {
    private readonly logger;
    handleAiAnalysis(job: Job<QueueJobData>): Promise<{
        success: boolean;
        processId: any;
    }>;
    onActive(job: Job): void;
    onCompleted(job: Job, result: any): void;
    onFailed(job: Job, err: Error): void;
}
