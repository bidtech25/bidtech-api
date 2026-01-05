import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
export declare class BpmnService implements OnModuleInit, OnModuleDestroy {
    private prisma;
    private readonly logger;
    private moddle;
    private browser;
    private isEnabled;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    svgToPng(svg: string): Promise<Buffer | null>;
}
