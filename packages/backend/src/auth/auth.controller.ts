import { Body, Controller, Post } from '@nestjs/common';
import { UserDocument } from 'src/users/user.schema';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  public create(@Body() registerUser: RegisterDto): Promise<UserDocument> {
    return this.authService.register(registerUser);
  }
}
