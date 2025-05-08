import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
