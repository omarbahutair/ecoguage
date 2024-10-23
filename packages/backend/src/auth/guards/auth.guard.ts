import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type User } from 'src/users/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (user) {
      return true;
    }

    return false;
  }
}
