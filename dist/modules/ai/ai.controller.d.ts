import { QueueService } from '@/modules/queues/services/queue.service';
import { PrismaService } from '@/prisma/prisma.service';
export declare class AiController {
    private queueService;
    private prisma;
    constructor(queueService: QueueService, prisma: PrismaService);
    startAnalysis(processId: string, dto: {
        input: string;
        model?: string;
        temperature?: number;
    }, userId: string): Promise<{
        jobId: string;
        status: string;
        message: string;
    }>;
    getResult(processId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        result: import("@prisma/client/runtime/library").JsonValue | null;
        processId: string;
        status: string;
    } | {
        status: string;
    }>;
}
