import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email' })
  public email: string;

  @IsStrongPassword({}, { message: 'Weak password' })
  public password: string;

  @IsString({ message: 'Invalid first name' })
  public firstName: string;

  @IsString({ message: 'Invalid last name' })
  public lastName: string;
}
