import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { KeysModule } from 'src/keys/keys.module';
import { KeysService } from 'src/keys/keys.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [KeysModule],
      inject: [KeysService],
      useFactory: (keysService: KeysService) => {
        const secret = keysService.get<string>('JWT_SECRET');

        return {
          global: true,
          secret,
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
