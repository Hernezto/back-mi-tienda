// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfiguration } from '../config/env.config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    // Configuración del módulo de configuración
    ConfigModule.forRoot({
      load: [envConfiguration], // Carga tu configuración personalizada
      isGlobal: true, // Hace que la configuración esté disponible en toda la aplicación
    }),
    
    TypeOrmModule.forFeature([User]),
    
    PassportModule.register({ 
      defaultStrategy: 'jwt',
      session: false // Desactiva sesiones si no las necesitas
    }),
    
    // Configuración asíncrona del JwtModule usando tu EnvConfiguration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.key'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
    }),
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule, // Exporta JwtModule para usarlo en otros módulos
  ],
})
export class AuthModule {}