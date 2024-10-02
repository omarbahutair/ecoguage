import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email' })
  public email: string;

  @IsString({ message: 'Invalid password' })
  public password: string;
}
