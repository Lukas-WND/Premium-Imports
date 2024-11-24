import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn']
  });
  const PORT = Number(process.env.SERVER_PORT) || 3000;
  
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  });

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
