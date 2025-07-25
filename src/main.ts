import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  // add global interceptor
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
