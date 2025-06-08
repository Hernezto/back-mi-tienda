import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginAuthDto, CreateAuthDto, UpdateAuthDto } from './dto';
import { JwtPayload } from '../interfaces/jwtpayload';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    console.log('createAuthDto', createAuthDto);
    const { password, ...userData } = createAuthDto;

    const user = await this.authRepository.findOneBy({
      email: createAuthDto.email,
    });

    if (user) throw new ConflictException('This username is in use');

    const passwordHash = bcrypt.hashSync(password, 10);
    const userCreate = await this.authRepository.create({
      ...userData,
      password: passwordHash,
    });
    await this.authRepository.save(userCreate);

    return {
      token: this.getJwt({
        id: userCreate.id,
        email: userCreate.email,
      }),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const user = await this.authRepository.findOneBy({ email });

    if (!user)
      throw new UnauthorizedException('Credenciales no validas (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credencailes no validas (password)');

    return {
      token: this.getJwt({
        id: user.id,
        email: user.email,
      }),
    };
  }

  async findAll() {
    const users = await this.authRepository.find();
    return users ;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async getAuthByToken(token: string) {
    let user: JwtPayload;
    try {
      user = this.jwtService.decode(token);
    } catch (e) {
      console.log('error', e);
      return JSON.stringify({ msg: 'Token no valido/expirado' });
    }

    if (!user) return JSON.stringify({ msg: 'Token no valido' });
    const { id } = user;
    const userData = await this.authRepository.findOneBy({ id });
    if (!userData) return JSON.stringify({ msg: 'Token no valido' });
    return JSON.stringify({
      id: userData.id,
      valid: true,
      token: userData.email,
      role: userData.rols,
    });
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
