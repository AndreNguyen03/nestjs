import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appMiddleware } from './app.middleware';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  appMiddleware(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
