import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { type Observable, map } from 'rxjs';

type ClassConstructor = new (...args: any[]) => object;

export class SerializeInterceptor implements NestInterceptor {
  public constructor(private readonly dto: ClassConstructor) {}

  public intercept(_: ExecutionContext, next: CallHandler): Observable<object> {
    return next.handle().pipe(
      map((data: any) => {
        if (data?.data) {
          const items = plainToInstance(this.dto, data.data, {
            excludeExtraneousValues: true,
          });

          return { ...data, data: items };
        }

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export function Serialize(
  dto: ClassConstructor,
): MethodDecorator & ClassDecorator {
  return UseInterceptors(new SerializeInterceptor(dto));
}
