import { Module } from '@nestjs/common';
import { BpmnService } from './bpmn.service';
import { BpmnController } from './bpmn.controller';

@Module({
  controllers: [BpmnController],
  providers: [BpmnService],
  exports: [BpmnService],
})
export class BpmnModule {}
