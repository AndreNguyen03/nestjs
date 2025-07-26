import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { config } from "aws-sdk";

export function appMiddleware(app: INestApplication) {
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Strips properties that do not have decorators
        forbidNonWhitelisted: true, // Throws an error if a property is not whitelisted
        transform: true, // Automatically transforms payloads to DTO instances
        transformOptions: {
            enableImplicitConversion: true,
        }
    }))

    const swaggerConfig = new DocumentBuilder()
        .setTitle('NestJS API')
        .setDescription('API documentation for the NestJS Blog application, base URL on http://localhost:3000')
        .setTermsOfService('http://localhost:3000/term-of-service')
        .setLicense('MIT License', 'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt')
        .addServer('http://localhost:3000', 'Development server')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('api', app, document);

    // setup aws sdk used uploading thefiles to aws s3 bucket
    const configService = app.get(ConfigService);
    config.update({
        credentials: {
            accessKeyId: configService.get('appConfig.awsAccessKeyId')!,
            secretAccessKey: configService.get('app.awsSecretAccessKey')!,
        },
        region: configService.get('appConfig.awsRegion')
    })

    // enable cors;
    app.enableCors();
}