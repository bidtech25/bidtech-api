import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AttachmentsService {
    private prisma;
    private config;
    private supabase;
    private bucketName;
    constructor(prisma: PrismaService, config: ConfigService);
    upload(processId: string, file: any, userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date | null;
        processId: string;
        url: string;
        fileType: string | null;
        size_bytes: number | null;
    }>;
    list(processId: string): Promise<{
        signedUrl: string;
        id: string;
        name: string;
        createdAt: Date | null;
        processId: string;
        url: string;
        fileType: string | null;
        size_bytes: number | null;
    }[]>;
    delete(attachmentId: string): Promise<{
        message: string;
    }>;
}
