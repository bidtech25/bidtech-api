"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BpmnService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpmnService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bpmn_moddle_1 = __importDefault(require("bpmn-moddle"));
const puppeteer_1 = __importDefault(require("puppeteer"));
let BpmnService = BpmnService_1 = class BpmnService {
    prisma;
    logger = new common_1.Logger(BpmnService_1.name);
    moddle;
    browser = null;
    isEnabled = false;
    constructor(prisma) {
        this.prisma = prisma;
        this.moddle = new bpmn_moddle_1.default();
    }
    async onModuleInit() {
        this.logger.log('Launching Puppeteer browser...');
        try {
            this.browser = await puppeteer_1.default.launch({
                headless: true,
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-software-rasterizer',
                    '--disable-extensions',
                    '--disable-crash-reporter',
                    '--disable-breakpad',
                ],
            });
            this.isEnabled = true;
            this.logger.log('✅ Puppeteer browser ready');
        }
        catch (error) {
            this.isEnabled = false;
            this.logger.warn('⚠️ Failed to launch Puppeteer browser. SVG to PNG conversion will not be available.');
            this.logger.error(`Puppeteer error details: ${error.message}`);
        }
    }
    async onModuleDestroy() {
        if (this.browser) {
            await this.browser.close();
            this.logger.log('Puppeteer browser closed');
        }
    }
    async svgToPng(svg) {
        if (!this.isEnabled || !this.browser) {
            this.logger.warn('SVG to PNG conversion requested but Puppeteer is not available.');
            return null;
        }
        const page = await this.browser.newPage();
        try {
            await page.setViewport({ width: 1200, height: 800 });
            await page.setContent(`<!DOCTYPE html><html><body>${svg}</body></html>`);
            const element = await page.$('svg');
            if (!element) {
                throw new Error('SVG element not found in rendered content');
            }
            const buffer = await element.screenshot({ type: 'png' });
            return Buffer.from(buffer);
        }
        finally {
            await page.close();
        }
    }
};
exports.BpmnService = BpmnService;
exports.BpmnService = BpmnService = BpmnService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BpmnService);
//# sourceMappingURL=bpmn.service.js.map