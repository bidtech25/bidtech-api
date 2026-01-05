import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;
  private readonly maxTokens = 4000;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'),
      timeout: 60000, // 60s
      maxRetries: 0,  // Controlar retry manualmente
    });
  }

  async analyzeProcess(
    processId: string,
    input: string,
    options?: { model?: string; temperature?: number },
    attempt: number = 1,
  ): Promise<any> {
    this.logger.log(`Analyzing process ${processId} (attempt ${attempt})`);

    try {
      const completion = await this.openai.chat.completions.create({
        model: options?.model || 'gpt-4o-mini',
        temperature: options?.temperature || 0.7,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em mapeamento de processos e análise de negócios.
Analise o processo descrito e retorne um JSON estruturado com:
- analysis: string (análise geral)
- suggestions: string[] (sugestões de melhoria)
- risks: string[] (riscos identificados)
- improvements: string[] (oportunidades de otimização)`,
          },
          {
            role: 'user',
            content: input,
          },
        ],
      });

      const rawContent = completion.choices[0].message.content;
      const result = this.parseAnalysis(rawContent);

      // TODO: AI Insights storage removed in V3 - save in process.steps or separate table later
      // await this.prisma.aiInsight.create(...)

      this.logger.log(`Analysis completed for process ${processId}`);
      return result;

    } catch (error: any) {
      // RETRY INTELIGENTE com Rate Limit handling
      if (error && error.status === 429 && attempt < 3) {
        const retryAfter = this.getRetryAfter(error);
        this.logger.warn(
          `Rate limit hit for process ${processId}. Retrying after ${retryAfter}ms`,
        );

        await this.sleep(retryAfter);
        return this.analyzeProcess(processId, input, options, attempt + 1);
      }

      // TODO: Error logging - AI Insights storage removed in V3
      // await this.prisma.aiInsight.create(...);

      this.logger.error(`Analysis failed for process ${processId}:`, error);
      throw error;
    }
  }

  private getRetryAfter(error: any): number {
    // Ler header Retry-After se disponível
    if (error.headers && error.headers['retry-after']) {
      const retryAfter = parseInt(error.headers['retry-after'], 10);
      return retryAfter * 1000; // Converter para ms
    }

    // Fallback: exponential backoff
    return Math.min(5000 * Math.pow(2, error.attempt || 0), 30000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private parseAnalysis(rawText: string | null): any {
    if (!rawText) return { analysis: '', suggestions: [], risks: [], improvements: [] };
    
    try {
      // Tentar parsear como JSON
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: estrutura básica
      return {
        analysis: rawText,
        suggestions: [],
        risks: [],
        improvements: [],
      };
    } catch (error) {
      this.logger.warn('Failed to parse AI response as JSON, using raw text');
      return {
        analysis: rawText,
        suggestions: [],
        risks: [],
        improvements: [],
      };
    }
  }
}
