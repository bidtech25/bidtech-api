import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiAnalysisProcessor } from './ai.processor';
import { QueuesModule } from '@/modules/queues/queues.module';

@Module({
  imports: [
    QueuesModule, // For QueueService
    BullModule.registerQueue(
       // Registering the queue here as well if needed for listening, 
       // but strictly speaking, processors are providers.
       // However, often better to keep queue registration centralised or per module usage.
       // Since QueuesModule exports BullModule, we might not strictly need registerQueue here unless we inject the queue.
       // We don't inject the queue here, we use QueueService.
    ),
  ],
  controllers: [AiController],
  providers: [AiService, AiAnalysisProcessor],
  exports: [AiService],
})
export class AiModule {}
