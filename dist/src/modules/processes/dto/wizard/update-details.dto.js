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
exports.UpdateDetailsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const process_step_dto_1 = require("../process-step.dto");
class SipocDto {
    suppliers;
    inputs;
    outputs;
    customers;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Fornecedor A', 'Fornecedor B'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SipocDto.prototype, "suppliers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Matéria prima', 'Especificações técnicas'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SipocDto.prototype, "inputs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Produto acabado', 'Relatório de qualidade'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SipocDto.prototype, "outputs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Cliente final', 'Distribuidor'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SipocDto.prototype, "customers", void 0);
class UpdateDetailsDto {
    steps;
    sipoc;
}
exports.UpdateDetailsDto = UpdateDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [process_step_dto_1.ProcessStepDto],
        description: 'Array de etapas do processo com responsáveis'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => process_step_dto_1.ProcessStepDto),
    __metadata("design:type", Array)
], UpdateDetailsDto.prototype, "steps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: SipocDto,
        description: 'SIPOC: Suppliers, Inputs, Process, Outputs, Customers'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SipocDto),
    __metadata("design:type", SipocDto)
], UpdateDetailsDto.prototype, "sipoc", void 0);
//# sourceMappingURL=update-details.dto.js.map