import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const isProduction = process.env.ENV === 'production';
  console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
  const corsOptions = {
    origin: isProduction
      ? 'https://tu-dominio-de-produccion.com'
      : [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:3000',
        ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Auth
  };

  app.enableCors(corsOptions);

  // Serve static files from the uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Optional: Add a prefix to the URL
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Server listen in port : ${process.env.PORT}`);
}
bootstrap();
