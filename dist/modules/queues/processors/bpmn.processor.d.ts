import type { Job } from 'bull';
import { QueueJobData } from '../services/queue.service';
import { BpmnService } from '@/modules/bpmn/bpmn.service';
export declare class BpmnProcessor {
    private readonly bpmnService;
    private readonly logger;
    constructor(bpmnService: BpmnService);
    handleBpmnGeneration(job: Job<QueueJobData>): Promise<{
        success: boolean;
        processId: any;
        format: any;
        result: string;
    }>;
}
