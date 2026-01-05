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
exports.CreateTenantDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTenantDto {
    companyName;
    cnpj;
    managerName;
    managerEmail;
}
exports.CreateTenantDto = CreateTenantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cliente X Ltda', description: 'Company Name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12.345.678/0001-90', description: 'CNPJ' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "cnpj", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'João Gestor', description: 'Manager Name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "managerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'joao@clientex.com.br', description: 'Manager Email' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "managerEmail", void 0);
//# sourceMappingURL=create-tenant.dto.js.map