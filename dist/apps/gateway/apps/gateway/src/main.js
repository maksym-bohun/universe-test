"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bodyParser = require("body-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(bodyParser.json({ limit: '200mb' }));
    app.enableShutdownHooks();
    await app.listen(process.env.PORT ?? 3000);
    process.on('SIGTERM', async () => {
        console.log('SIGTERM received, closing app...');
        await app.close();
        process.exit(0);
    });
    process.on('SIGINT', async () => {
        console.log('SIGINT received, closing app...');
        await app.close();
        process.exit(0);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map