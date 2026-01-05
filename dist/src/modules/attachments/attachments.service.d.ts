import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AttachmentsService {
    private prisma;
    private config;
    private supabase;
    private bucketName;
    constructor(prisma: PrismaService, config: ConfigService);
    upload(processId: string, file: any, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date | null;
        processId: string;
        url: string;
        fileType: string | null;
        size_bytes: number | null;
    }>;
    list(processId: string): Promise<{
        signedUrl: string;
        name: string;
        id: string;
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
