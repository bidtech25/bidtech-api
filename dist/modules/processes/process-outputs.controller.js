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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessOutputsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const processes_service_1 = require("./processes.service");
let ProcessOutputsController = class ProcessOutputsController {
    service;
    constructor(service) {
        this.service = service;
    }
    addOutput(processId, dto, userId) {
        return this.service.addOutput(processId, dto, userId);
    }
    removeOutput(processId, outputId, userId) {
        return this.service.removeOutput(processId, outputId, userId);
    }
};
exports.ProcessOutputsController = ProcessOutputsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar output ao processo' }),
    __param(0, (0, common_1.Param)('processId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ProcessOutputsController.prototype, "addOutput", null);
__decorate([
    (0, common_1.Delete)(':outputId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover output do processo' }),
    __param(0, (0, common_1.Param)('processId')),
    __param(1, (0, common_1.Param)('outputId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProcessOutputsController.prototype, "removeOutput", null);
exports.ProcessOutputsController = ProcessOutputsController = __decorate([
    (0, swagger_1.ApiTags)('Processes - Outputs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('processes/:processId/outputs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [processes_service_1.ProcessesService])
], ProcessOutputsController);
//# sourceMappingURL=process-outputs.controller.js.map