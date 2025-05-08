import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
