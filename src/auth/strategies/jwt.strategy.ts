import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../interfaces/jwtpayload';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) 
    private readonly authRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {
    const jwtSecret = configService.get<string>('jwt.key');
    
    if (!jwtSecret) {
      throw new Error('JWT secret key is not defined in configuration');
    }

    super({
      secretOrKey: jwtSecret, // Ahora seguro que es string
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.authRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive, talk with admin');
    }

    return user;
  }
}