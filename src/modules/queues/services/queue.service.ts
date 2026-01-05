import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue, JobOptions } from 'bull';
import { v4 as uuid } from 'uuid';

export interface QueueJobData<T = any> {
  id: string;
  userId: string;
  payload: T;
  createdAt: Date;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('ai') private aiQueue: Queue,
    @InjectQueue('bpmn') private bpmnQueue: Queue,
  ) {}

  async addAiAnalysis(
    payload: { processId: string; input: string; options?: any },
    userId: string,
    options?: JobOptions,
  ): Promise<string> {
    const jobData: QueueJobData = {
      id: uuid(),
      userId,
      payload,
      createdAt: new Date(),
    };

    const job = await this.aiQueue.add('analyze', jobData, options);
    return job.id.toString();
  }

  async addBpmnGeneration(
    payload: { processId: string; format: string; analysisId?: string },
    userId: string,
    options?: JobOptions,
  ): Promise<string> {
    const jobData: QueueJobData = {
      id: uuid(),
      userId,
      payload,
      createdAt: new Date(),
    };

    const job = await this.bpmnQueue.add('generate', jobData, options);
    return job.id.toString();
  }

  // Helpers para monitoramento
  async getJobStatus(queueName: 'ai' | 'bpmn', jobId: string) {
    const queue = queueName === 'ai' ? this.aiQueue : this.bpmnQueue;
    
    // Convert jobId directly since queue.getJob expects JobId (string | number)
    const job = await queue.getJob(jobId);
    
    if (!job) return null;

    return {
      id: job.id,
      state: await job.getState(),
      progress: job.progress(),
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
    };
  }
}
