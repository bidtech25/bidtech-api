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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStepDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ProcessStepDto {
    title;
    description;
    inputs;
    outputs;
    responsibleId;
    order;
}
exports.ProcessStepDto = ProcessStepDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Aprovação de Compra',
        description: 'Nome da etapa do processo'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ProcessStepDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Gerente analisa requisição e aprova ou rejeita com base no orçamento',
        description: 'Descrição detalhada da etapa'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessStepDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Requisição preenchida', 'Orçamentos anexados', 'Aprovação do diretor'],
        description: 'Entradas necessárias para executar esta etapa'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ProcessStepDto.prototype, "inputs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Requisição aprovada', 'Email de confirmação enviado'],
        description: 'Saídas geradas por esta etapa'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ProcessStepDto.prototype, "outputs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID do colaborador responsável por executar esta etapa'
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProcessStepDto.prototype, "responsibleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Ordem de execução da etapa',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProcessStepDto.prototype, "order", void 0);
//# sourceMappingURL=process-step.dto.js.map