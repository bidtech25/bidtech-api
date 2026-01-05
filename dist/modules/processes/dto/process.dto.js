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
exports.UpdateProcessDto = exports.CreateProcessDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProcessDto {
    name;
    processDescription;
}
exports.CreateProcessDto = CreateProcessDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Recrutamento e Seleção' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProcessDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Processo padronizado de contratação de novos colaboradores', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProcessDto.prototype, "processDescription", void 0);
class UpdateProcessDto {
    name;
    processDescription;
}
exports.UpdateProcessDto = UpdateProcessDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Recrutamento e Seleção 2.0', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProcessDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Descrição atualizada', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProcessDto.prototype, "processDescription", void 0);
//# sourceMappingURL=process.dto.js.map