import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

}
