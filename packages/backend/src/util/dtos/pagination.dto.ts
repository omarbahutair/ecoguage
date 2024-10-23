import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && !isNaN(parseInt(value))) {
      return parseInt(value);
    }

    return value;
  })
  @IsInt({ message: 'Invalid page size' })
  @Min(0, { message: 'Page size must be at least 0' })
  public pageSize?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && !isNaN(parseInt(value))) {
      return parseInt(value);
    }

    return value;
  })
  @IsInt({ message: 'Invalid page' })
  @Min(0, { message: 'Page must be at least 0' })
  public page?: number;
}
