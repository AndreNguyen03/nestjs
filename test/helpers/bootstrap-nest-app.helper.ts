import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "aws-sdk";
import { appMiddleware } from "src/app.middleware";
import { AppModule } from "src/app.module";

export async function bootstrapNestApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule, ConfigModule],
        providers: [ConfigService]
    }).compile();

    const app = moduleFixture.createNestApplication();
    appMiddleware(app);
    await app.init();
    return app;
}