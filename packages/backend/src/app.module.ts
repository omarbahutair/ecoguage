import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeysModule } from './keys/keys.module';
import { KeysService } from './keys/keys.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BuildingsModule } from './buildings/buildings.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [KeysModule],
      inject: [KeysService],
      useFactory(keysService: KeysService) {
        return {
          uri: keysService.get('MONGO_URI'),
        };
      },
    }),
    ScheduleModule.forRoot(),
    KeysModule,
    UsersModule,
    AuthModule,
    BuildingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
