import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import BpmnModdle from 'bpmn-moddle';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class BpmnService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BpmnService.name);
  private moddle: BpmnModdle;
  private browser: Browser | null = null; // SINGLETON
  private isEnabled = false; // Flag para indicar se Puppeteer está disponível

  constructor(private prisma: PrismaService) {
    this.moddle = new BpmnModdle();
  }

  async onModuleInit() {
    // Lançar browser UMA VEZ na inicialização
    this.logger.log('Launching Puppeteer browser...');
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage', // Importante para Docker
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-extensions',
          '--disable-crash-reporter', // Desabilita crash handler que causa erro no Docker
          '--disable-breakpad',
        ],
      });
      this.isEnabled = true;
      this.logger.log('✅ Puppeteer browser ready');
    } catch (error) {
      this.isEnabled = false;
      this.logger.warn('⚠️ Failed to launch Puppeteer browser. SVG to PNG conversion will not be available.');
      this.logger.error(`Puppeteer error details: ${error.message}`);
      // Não lançar erro - permitir que a aplicação inicie mesmo sem Puppeteer
    }
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
      this.logger.log('Puppeteer browser closed');
    }
  }

  public async svgToPng(svg: string): Promise<Buffer | null> {
    if (!this.isEnabled || !this.browser) {
      this.logger.warn('SVG to PNG conversion requested but Puppeteer is not available.');
      return null; // Retorna null em vez de quebrar a aplicação
    }
    // Reutilizar browser, criar APENAS nova página
    const page = await this.browser.newPage();
    
    try {
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`<!DOCTYPE html><html><body>${svg}</body></html>`);
      
      const element = await page.$('svg');
      if (!element) {
        throw new Error('SVG element not found in rendered content');
      }
      const buffer = await element.screenshot({ type: 'png' });
      
      // Ensure buffer is a Buffer (Puppeteer can return binary string or base64 based on encoding)
      // By default with type 'png' it returns Uint8Array or Buffer in Node.
      return Buffer.from(buffer); 
    } finally {
      await page.close(); // SEMPRE fechar a página, NÃO o browser
    }
  }
}
