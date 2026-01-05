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
exports.ProcessesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const processes_service_1 = require("./processes.service");
const create_process_wizard_dto_1 = require("./dto/create-process-wizard.dto");
const update_scope_dto_1 = require("./dto/wizard/update-scope.dto");
const update_details_dto_1 = require("./dto/wizard/update-details.dto");
const update_objective_dto_1 = require("./dto/wizard/update-objective.dto");
const update_flowchart_dto_1 = require("./dto/wizard/update-flowchart.dto");
let ProcessesController = class ProcessesController {
    service;
    constructor(service) {
        this.service = service;
    }
    createDraft(user, dto) {
        return this.service.createDraft(user.id, null, dto);
    }
    updateObjective(id, dto) {
        return this.service.updateDraft(id, dto);
    }
    updateScope(id, dto) {
        return this.service.updateDraft(id, dto);
    }
    updateDetails(id, dto) {
        return this.service.updateDraft(id, dto);
    }
    updateFlowchart(id, dto) {
        return this.service.updateDraft(id, dto);
    }
    publish(id, user) {
        return this.service.publish(id, user.id);
    }
    findOne(id, user) {
        return this.service.findOne(id, user.id);
    }
};
exports.ProcessesController = ProcessesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Passo 1: Criar Rascunho do Processo' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_process_wizard_dto_1.CreateProcessWizardDto]),
    __metadata("design:returntype", void 0)
], ProcessesController.prototype, "createDraft", null);
__decorate([
    (0, common_1.Patch)(':id/objective'),
    (0, swagger_1.ApiOperation)({ summary: 'Passo 2: Atualizar Objetivo e Metas' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_objective_dto_1.UpdateObjectiveDto]),
    __metadata("design:returntype", void 0)
], ProcessesController.prototype, "updateObjective", null);
__decorate([
    (0, common_1.Patch)(':id/scope'),
    (0, swagger_1.ApiOperation)({ summary: 'Passo 3: Atualizar Escopo e Fronteiras' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_scope_dto_1.UpdateScopeDto]),
    __metadata("design:returntype", void 0)
], ProcessesController.prototype, "updateScope", null);
__decorate([
    (0, common_1.Patch)(':id/details'),
    (0, swagger_1.ApiOperation)({ summary: 'Passo 4: Atualizar Detalhes (SIPOC)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_details_dto_1.UpdateDetailsDto]),
    __metadata("design:returntype", void 0)
], ProcessesController.prototype, "updateDetails", null);
__decorate([
    (0, common_1.Patch)(':id/flowchart'),
    (0, swagger_1.ApiOperation)({ summary: 'Passo 6: Salvar URL do Fluxograma' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_flowchart_dto_1.UpdateFlowchartDto]),
    __metadata("design:returntype", void 0)
], ProcessesController.prototype, "updateFlowchart", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Passo 7: Publicar Processo (Finalizar)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcessesController.prototype, "publish", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar Processo Completo (Revisão)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcessesController.prototype, "findOne", null);
exports.ProcessesController = ProcessesController = __decorate([
    (0, swagger_1.ApiTags)('Process Wizard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('processes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [processes_service_1.ProcessesService])
], ProcessesController);
//# sourceMappingURL=processes.controller.js.map