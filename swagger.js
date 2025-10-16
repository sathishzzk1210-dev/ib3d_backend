"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app, type) {
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Anima API')
        .setDescription('API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    document.security = [{ bearer: [] }];
    swagger_1.SwaggerModule.setup('api-docs', app, document);
}
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map