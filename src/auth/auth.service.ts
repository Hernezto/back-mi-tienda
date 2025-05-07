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
    const { password, ...userData } = createAuthDto;
    
    const user = await this.authRepository.findOneBy({
      username: createAuthDto.username,
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
          username: userCreate.username,
        }),
      };
      
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { username, password } = loginAuthDto;
    const user = await this.authRepository.findOneBy({ username: username });

    if (!user)
      throw new UnauthorizedException('Credenciales no validas (username)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credencailes no validas (password)');

    return {
      token: this.getJwt({
        id: user.id,
        username: user.username,
      }),
    };
  }

  async findAll() {
    const users = await this.authRepository.find();
    return { userlist: users };
  }
  
  findOne(id: number) {
    return `This action returns a #${id} auth`;
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
