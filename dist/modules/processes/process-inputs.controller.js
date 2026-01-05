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
exports.ProcessInputsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const processes_service_1 = require("./processes.service");
let ProcessInputsController = class ProcessInputsController {
    service;
    constructor(service) {
        this.service = service;
    }
    addInput(processId, dto, userId) {
        return this.service.addInput(processId, dto, userId);
    }
    removeInput(processId, inputId, userId) {
        return this.service.removeInput(processId, inputId, userId);
    }
};
exports.ProcessInputsController = ProcessInputsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar input ao processo' }),
    __param(0, (0, common_1.Param)('processId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ProcessInputsController.prototype, "addInput", null);
__decorate([
    (0, common_1.Delete)(':inputId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover input do processo' }),
    __param(0, (0, common_1.Param)('processId')),
    __param(1, (0, common_1.Param)('inputId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProcessInputsController.prototype, "removeInput", null);
exports.ProcessInputsController = ProcessInputsController = __decorate([
    (0, swagger_1.ApiTags)('Processes - Inputs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('processes/:processId/inputs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [processes_service_1.ProcessesService])
], ProcessInputsController);
//# sourceMappingURL=process-inputs.controller.js.map