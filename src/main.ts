import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips properties that do not have decorators
    forbidNonWhitelisted: true, // Throws an error if a property is not whitelisted
    transform: true, // Automatically transforms payloads to DTO instances
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
