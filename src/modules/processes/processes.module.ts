import { Module } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { CacheModuleCustom } from '@/modules/cache/cache.module';

@Module({
  imports: [CacheModuleCustom],
  controllers: [ProcessesController],
  providers: [ProcessesService],
})
export class ProcessesModule {}
