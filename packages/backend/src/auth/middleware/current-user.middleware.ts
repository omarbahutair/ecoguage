import { Injectable, type NestMiddleware } from '@nestjs/common';
import { type Request, type Response, type NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { type User } from 'src/users/user.schema';
import { isValidObjectId, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { KeysService } from 'src/keys/keys.service';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  public constructor(
    private readonly keysService: KeysService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public async use(
    request: Request,
    _: Response,
    next: NextFunction,
  ): Promise<void> {
    const jwtSecret = this.keysService.get<string>('JWT_SECRET');

    const token = CurrentUserMiddleware.extractTokenFromHeader(request);

    if (!token) {
      next();
      return;
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });

      if (!isValidObjectId(payload?.sub)) throw new Error('Invalid user ID');

      const user = await this.usersService.findById(payload.sub);

      if (!user) throw new Error('User not found');

      request.user = user;

      next();
    } catch {
      next();
    }
  }

  private static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
