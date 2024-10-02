import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registerUser: RegisterDto): Promise<JwtResponse> {
    // 1) check email is not used
    const isEmailUsed = await this.usersService.findByEmail(registerUser.email);

    if (isEmailUsed) throw new BadRequestException('Email is already used');

    // 2) hash password
    const hashedPassword = await AuthService.hashPassword(
      registerUser.password,
    );

    const registeredUser = await this.usersService.create({
      ...registerUser,
      password: hashedPassword,
    });

    return {
      accessToken: this.generateJwt({ sub: registeredUser._id.toString() }),
    };
  }

  public async login(loginUser: LoginDto): Promise<JwtResponse> {
    // 1) check if user exists
    const user = await this.usersService.findByEmail(loginUser.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const [, salt] = user.password.split('.');

    const insertedHashedPassword = await AuthService.hashPassword(
      loginUser.password,
      salt,
    );

    if (insertedHashedPassword !== user.password)
      throw new UnauthorizedException('Invalid credentials');

    return {
      accessToken: this.generateJwt({ sub: user._id.toString() }),
    };
  }

  private static async hashPassword(
    password: string,
    salt?: string,
  ): Promise<string> {
    salt = salt ?? this.generateStringSequence();

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    return `${hash.toString('hex')}.${salt}`;
  }

  public static generateStringSequence(length = 6): string {
    const seq = Math.random().toString().split('.')[1].substring(0, length);

    return seq;
  }

  public generateJwt(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
