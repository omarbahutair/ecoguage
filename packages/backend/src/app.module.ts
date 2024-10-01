import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeysModule } from './keys/keys.module';
import { KeysService } from './keys/keys.service';

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
    KeysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
