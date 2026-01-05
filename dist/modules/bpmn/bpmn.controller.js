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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BpmnController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpmnController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bpmn_service_1 = require("./bpmn.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BpmnController = BpmnController_1 = class BpmnController {
    bpmnService;
    logger = new common_1.Logger(BpmnController_1.name);
    constructor(bpmnService) {
        this.bpmnService = bpmnService;
    }
    async convertToPng(svg, res) {
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
        }
        catch (error) {
            this.logger.error('Failed to convert SVG to PNG', error);
            res.status(500).json({ message: 'Conversion failed' });
        }
    }
};
exports.BpmnController = BpmnController;
__decorate([
    (0, common_1.Post)('convert'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { svg: { type: 'string' } } } }),
    __param(0, (0, common_1.Body)('svg')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BpmnController.prototype, "convertToPng", null);
exports.BpmnController = BpmnController = BpmnController_1 = __decorate([
    (0, swagger_1.ApiTags)('BPMN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('bpmn'),
    __metadata("design:paramtypes", [bpmn_service_1.BpmnService])
], BpmnController);
//# sourceMappingURL=bpmn.controller.js.map