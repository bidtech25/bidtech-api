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
exports.UpdateScopeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateScopeDto {
    scopeStart;
    scopeEnd;
    inScope;
    outOfScope;
    involvedAreas;
    involvedPeople;
}
exports.UpdateScopeDto = UpdateScopeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Onde o processo começa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateScopeDto.prototype, "scopeStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Onde o processo termina' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateScopeDto.prototype, "scopeEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Itens dentro do escopo',
        type: [String],
        example: ['Recebimento de pedidos', 'Aprovação gerencial']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateScopeDto.prototype, "inScope", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Itens fora do escopo',
        type: [String],
        example: ['Pagamentos', 'Logística']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateScopeDto.prototype, "outOfScope", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Áreas envolvidas',
        type: [String],
        example: ['Vendas', 'TI', 'RH']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateScopeDto.prototype, "involvedAreas", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pessoas envolvidas (array após ALTER TABLE)',
        type: [String],
        example: ['João Silva', 'Maria Santos']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateScopeDto.prototype, "involvedPeople", void 0);
//# sourceMappingURL=update-scope.dto.js.map