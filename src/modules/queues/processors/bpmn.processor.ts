import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { QueueJobData } from '../services/queue.service';
import { BpmnService } from '@/modules/bpmn/bpmn.service';

@Processor('bpmn')
export class BpmnProcessor {
  private readonly logger = new Logger(BpmnProcessor.name);

  constructor(
    private readonly bpmnService: BpmnService,
  ) {}

  @Process('generate')
  async handleBpmnGeneration(job: Job<QueueJobData>) {
    this.logger.log(`Processing BPMN generation job ${job.id}`);

    try {
      const { processId, format, svg } = job.data.payload;

      await job.progress(10);

      // Se temos SVG, converter. Se não, talvez gerar via outro meio?
      // Assumindo que o payload pode vir com SVG para conversão
      let result: string | null = null;
      if (format === 'png' && svg) {
          const buffer = await this.bpmnService.svgToPng(svg);
          
          if (buffer) {
            // Aqui poderíamos salvar o buffer no storage (Supabase Storage) 
            // e retornar a URL. Por enquanto, retornamos base64 para simplificar ou mock
            result = buffer.toString('base64');
          } else {
            this.logger.warn('Puppeteer service unavailable. Cannot convert SVG to PNG.');
          }
      }

      await job.progress(100);

      return { success: true, processId, format, result: result ? 'Base64 Image Generated' : 'No SVG provided' };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`BPMN generation job ${job.id} failed:`, error.stack);
      } else {
         this.logger.error(`BPMN generation job ${job.id} failed with unknown error`);
      }
      throw error;
    }
  }
}
