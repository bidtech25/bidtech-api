"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckOwnership = exports.OWNERSHIP_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.OWNERSHIP_KEY = 'ownership';
const CheckOwnership = (resourceType) => (0, common_1.SetMetadata)(exports.OWNERSHIP_KEY, resourceType);
exports.CheckOwnership = CheckOwnership;
//# sourceMappingURL=check-ownership.decorator.js.map