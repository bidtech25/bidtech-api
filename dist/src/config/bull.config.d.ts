import { BullModuleOptions } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
export declare const bullConfig: (config: ConfigService) => BullModuleOptions;
