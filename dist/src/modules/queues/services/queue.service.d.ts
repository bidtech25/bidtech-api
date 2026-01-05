import type { Queue, JobOptions } from 'bull';
export interface QueueJobData<T = any> {
    id: string;
    userId: string;
    payload: T;
    createdAt: Date;
}
export declare class QueueService {
    private aiQueue;
    private bpmnQueue;
    constructor(aiQueue: Queue, bpmnQueue: Queue);
    addAiAnalysis(payload: {
        processId: string;
        input: string;
        options?: any;
    }, userId: string, options?: JobOptions): Promise<string>;
    addBpmnGeneration(payload: {
        processId: string;
        format: string;
        analysisId?: string;
    }, userId: string, options?: JobOptions): Promise<string>;
    getJobStatus(queueName: 'ai' | 'bpmn', jobId: string): Promise<{
        id: import("bull").JobId;
        state: import("bull").JobStatus | "stuck";
        progress: any;
        failedReason: string | undefined;
        finishedOn: number | undefined;
    } | null>;
}
