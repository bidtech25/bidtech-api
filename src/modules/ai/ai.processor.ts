import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { AiService } from './ai.service';
import { QueueJobData } from '@/modules/queues/services/queue.service';

@Processor('ai')
export class AiAnalysisProcessor {
  private readonly logger = new Logger(AiAnalysisProcessor.name);

  constructor(private aiService: AiService) {}

  @Process('analyze')
  async handleAnalysis(job: Job<QueueJobData>) {
    this.logger.log(`Processing AI analysis job ${job.id}`);

    try {
      const { processId, input, options } = job.data.payload;

      await job.progress(10);
      
      const result = await this.aiService.analyzeProcess(
        processId,
        input,
        options,
      );

      await job.progress(100);

      return { success: true, result };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`AI analysis job ${job.id} failed:`, error.stack);
      } else {
        this.logger.error(`AI analysis job ${job.id} failed with unknown error`);
      }
      throw error;
    }
  }
}
