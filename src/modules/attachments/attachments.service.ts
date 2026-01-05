import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AttachmentsService {
  private supabase: SupabaseClient;
  private bucketName = 'process-files';

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const supabaseUrl = this.config.get<string>('SUPABASE_URL');
    const supabaseKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY') || 
                        this.config.get<string>('SUPABASE_JWT_SECRET');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async upload(
    processId: string,
    file: any, // Express.Multer.File
    userId: string,
  ) {
    // 1. Verify process exists
    const process = await this.prisma.process.findUnique({
      where: { id: processId },
      select: { id: true, company: { select: { id: true } } },
    });

    if (!process) {
      throw new NotFoundException('Process not found');
    }

    const companyId = process.company.id;

    // 2. Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${companyId}/${processId}/${timestamp}_${sanitizedName}`;

    // 3. Upload to Supabase Storage
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    // 4. Get public URL
    const { data: urlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    // 5. Save metadata to database
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

  async list(processId: string) {
    const attachments = await this.prisma.processAttachment.findMany({
      where: { processId },
      orderBy: { createdAt: 'desc' },
    });

    // Generate signed URLs (valid for 1 hour)
    const attachmentsWithSignedUrls = await Promise.all(
      attachments.map(async (att) => {
        const filePath = att.url.split(`/${this.bucketName}/`)[1];
        
        if (!filePath) return { ...att, signedUrl: att.url };

        const { data } = await this.supabase.storage
          .from(this.bucketName)
          .createSignedUrl(filePath, 3600); // 1 hour

        return {
          ...att,
          signedUrl: data?.signedUrl || att.url,
        };
      }),
    );

    return attachmentsWithSignedUrls;
  }

  async delete(attachmentId: string) {
    const attachment = await this.prisma.processAttachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    // Delete from storage
    const filePath = attachment.url.split(`/${this.bucketName}/`)[1];
    if (filePath) {
      await this.supabase.storage.from(this.bucketName).remove([filePath]);
    }

    // Delete from database
    await this.prisma.processAttachment.delete({
      where: { id: attachmentId },
    });

    return { message: 'Attachment deleted successfully' };
  }
}
