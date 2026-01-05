import { AttachmentsService } from './attachments.service';
export declare class AttachmentsController {
    private readonly service;
    constructor(service: AttachmentsService);
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
