import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/user.schema';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { RegisterDto } from './dtos/register.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  public constructor(private readonly usersService: UsersService) {}

  public async register(registerUser: RegisterDto): Promise<UserDocument> {
    // 1) check email is not used
    const isEmailUsed = this.usersService.findByEmail(registerUser.email);

    if (isEmailUsed) throw new BadRequestException('Email is already used');

    // 2) hash password
    const hashedPassword = await AuthService.hashPassword(
      registerUser.password,
    );

    return this.usersService.create({
      ...registerUser,
      password: hashedPassword,
    });
  }

  public static async hashPassword(
    password: string,
    salt?: string,
  ): Promise<string> {
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    salt = salt ?? this.generateStringSequence();

    return `${hash.toString('hex')}.${salt}`;
  }

  public static generateStringSequence(length = 6): string {
    const seq = Math.random().toString().split('.')[1].substring(0, length);

    return seq;
  }
}
