import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeysService {
  public constructor(private readonly configService: ConfigService) {}

  public get<T>(key: string): T {
    const value = this.configService.get<T>(key);

    if (!value) throw new Error(`${key} is not set as an environment variable`);

    return value;
  }
}
