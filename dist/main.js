"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const config = app.get(config_1.ConfigService);
    const apiPrefix = config.get('API_PREFIX', 'api/v1');
    app.setGlobalPrefix(apiPrefix);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('BidTech API')
        .setDescription('API de Mapeamento de Processos com IA')
        .setVersion('2.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT do Supabase',
    })
        .addServer(`http://localhost:${config.get('PORT')}`, 'Development')
        .addServer('https://bidtech-bidtech-api.judbsq.easypanel.host', 'Easypanel')
        .addServer('https://api.bidtech.com.br', 'Production')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });
    app.enableShutdownHooks();
    const port = config.get('PORT', 3000);
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
    logger.log(`📚 Swagger docs: http://localhost:${port}/${apiPrefix}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map