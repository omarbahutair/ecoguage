import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHealthy(): string {
    return 'healthy';
  }
}
