import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDocument } from 'src/users/user.schema';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';

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

  @Get('whoami')
  @Serialize(UserDto)
  public whoami(@CurrentUser() currentUser: UserDocument) {
    return currentUser;
  }
}
