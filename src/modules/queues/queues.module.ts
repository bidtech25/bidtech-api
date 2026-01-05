import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { bullConfig } from '@/config/bull.config';
import { QueueService } from './services/queue.service';
import { BpmnProcessor } from './processors/bpmn.processor';
import { BpmnModule } from '@/modules/bpmn/bpmn.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: bullConfig,
    }),
    BullModule.registerQueue(
      { name: 'ai' },
      { name: 'bpmn' },
    ),
    BpmnModule,
  ],
  providers: [QueueService, BpmnProcessor],
  exports: [QueueService, BullModule],
})
export class QueuesModule {}
