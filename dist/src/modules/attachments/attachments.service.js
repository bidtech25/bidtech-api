"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let AttachmentsService = class AttachmentsService {
    prisma;
    config;
    supabase;
    bucketName = 'process-files';
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        const supabaseUrl = this.config.get('SUPABASE_URL');
        const supabaseKey = this.config.get('SUPABASE_SERVICE_ROLE_KEY') ||
            this.config.get('SUPABASE_JWT_SECRET');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials missing');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async upload(processId, file, userId) {
        const process = await this.prisma.process.findUnique({
            where: { id: processId },
            select: { id: true, company: { select: { id: true } } },
        });
        if (!process) {
            throw new common_1.NotFoundException('Process not found');
        }
        const companyId = process.company.id;
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${companyId}/${processId}/${timestamp}_${sanitizedName}`;
        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        if (error) {
            throw new common_1.BadRequestException(`Upload failed: ${error.message}`);
        }
        const { data: urlData } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filePath);
        const attachment = await this.prisma.processAttachment.create({
            data: {
                processId,
                name: file.originalname,
                url: urlData.publicUrl,
                fileType: file.mimetype,
                size_bytes: file.size,
            },
        });
        return attachment;
    }
    async list(processId) {
        const attachments = await this.prisma.processAttachment.findMany({
            where: { processId },
            orderBy: { createdAt: 'desc' },
        });
        const attachmentsWithSignedUrls = await Promise.all(attachments.map(async (att) => {
            const filePath = att.url.split(`/${this.bucketName}/`)[1];
            if (!filePath)
                return { ...att, signedUrl: att.url };
            const { data } = await this.supabase.storage
                .from(this.bucketName)
                .createSignedUrl(filePath, 3600);
            return {
                ...att,
                signedUrl: data?.signedUrl || att.url,
            };
        }));
        return attachmentsWithSignedUrls;
    }
    async delete(attachmentId) {
        const attachment = await this.prisma.processAttachment.findUnique({
            where: { id: attachmentId },
        });
        if (!attachment) {
            throw new common_1.NotFoundException('Attachment not found');
        }
        const filePath = attachment.url.split(`/${this.bucketName}/`)[1];
        if (filePath) {
            await this.supabase.storage.from(this.bucketName).remove([filePath]);
        }
        await this.prisma.processAttachment.delete({
            where: { id: attachmentId },
        });
        return { message: 'Attachment deleted successfully' };
    }
};
exports.AttachmentsService = AttachmentsService;
exports.AttachmentsService = AttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AttachmentsService);
//# sourceMappingURL=attachments.service.js.map