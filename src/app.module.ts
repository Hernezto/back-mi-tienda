import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiValidationSchema } from './config/joi.config';
import { envConfiguration } from './config/env.config';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    ConfigModule.forRoot({
      load: [envConfiguration],
      validationSchema: JoiValidationSchema,
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la app
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        database: configService.get<string>('database.name'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        autoLoadEntities: true,
        synchronize: true, // Solo sincroniza en dev
        // Opciones adicionales para mejor manejo de conexiones
        pool: {
          max: 20, // Máximo de conexiones
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
        logging: configService.get<string>('environment') === 'dev', // Logs solo en desarrollo
      }),
    }),
    
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}