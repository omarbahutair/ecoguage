import { NestFactory } from '@nestjs/core';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory(errors) {
        const validationErrors: Record<string, string[]> = {};

        for (let i = 0; i < errors.length; i += 1) {
          const error = errors[i];

          validationErrors[error.property] = Object.values(error.constraints);
        }

        return new UnprocessableEntityException({
          statusCode: 422,
          error: 'Unprocessable entity',
          validationErrors,
        });
      },
    }),
  );

  await app.listen(5000);
}
bootstrap();
