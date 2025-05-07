import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
export class CreateAuthDto {
 
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
  
  @IsOptional()
  isLogged?: boolean;
}
