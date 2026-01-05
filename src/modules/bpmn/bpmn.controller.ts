import { Controller, Post, Body, Res, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { Response } from 'express';
import { BpmnService } from './bpmn.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('BPMN')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bpmn')
export class BpmnController {
  private readonly logger = new Logger(BpmnController.name);

  constructor(private readonly bpmnService: BpmnService) {}

  @Post('convert')
  @ApiConsumes('application/json')
  @ApiBody({ schema: { type: 'object', properties: { svg: { type: 'string' } } } })
  async convertToPng(@Body('svg') svg: string, @Res() res: Response) {
    try {
      const buffer = await this.bpmnService.svgToPng(svg);
      
      if (!buffer) {
        return res.status(503).json({ 
          message: 'SVG to PNG conversion is currently unavailable. Puppeteer service is not running.' 
        });
      }
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="process.png"',
        'Content-Length': buffer.length,
      });

      res.end(buffer);
    } catch (error) {
      this.logger.error('Failed to convert SVG to PNG', error);
      res.status(500).json({ message: 'Conversion failed' });
    }
  }
}
