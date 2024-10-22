import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email' })
  public email: string;

  @IsStrongPassword({}, { message: 'Weak password' })
  public password: string;

  @IsString({ message: 'Invalid first name' })
  @MinLength(2, { message: 'First name is required' })
  public firstName: string;

  @IsString({ message: 'Invalid last name' })
  @MinLength(2, { message: 'Last name is required' })
  public lastName: string;
}
