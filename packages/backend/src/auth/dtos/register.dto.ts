import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  public email: string;

  @IsStrongPassword()
  public password: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;
}
