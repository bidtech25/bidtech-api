import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { QueueService } from '@/modules/queues/services/queue.service';
import { PrismaService } from '@/prisma/prisma.service';

@ApiTags('AI')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private queueService: QueueService,
    private prisma: PrismaService,
  ) {}

  @Post('analyze/:processId')
  async startAnalysis(
    @Param('processId') processId: string,
    @Body() dto: { input: string; model?: string; temperature?: number },
    @CurrentUser('id') userId: string,
  ) {
    const jobId = await this.queueService.addAiAnalysis(
      { processId, input: dto.input, options: { model: dto.model, temperature: dto.temperature } },
      userId,
    );

    return { jobId, status: 'queued', message: 'Analysis started' };
  }

  @Get('result/:processId')
  async getResult(
    @Param('processId') processId: string,
    @CurrentUser('id') userId: string,
  ) {
    // TODO: AI Insights storage removed in V3 - implement later
    // const analysis = await this.prisma.aiInsight.findFirst(...);
    return { status: 'not_implemented', message: 'AI Insights V3 pending' };
  }
}
