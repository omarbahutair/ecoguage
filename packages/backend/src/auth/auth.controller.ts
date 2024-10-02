import { Body, Controller, Post } from '@nestjs/common';
import { UserDocument } from 'src/users/user.schema';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  public register(@Body() registerUser: RegisterDto): Promise<JwtResponse> {
    return this.authService.register(registerUser);
  }

  @Post('login')
  public login(@Body() loginUser: LoginDto): Promise<JwtResponse> {
    return this.authService.login(loginUser);
  }
}
