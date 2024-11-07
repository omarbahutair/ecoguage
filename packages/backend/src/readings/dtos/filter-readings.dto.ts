import { Transform } from 'class-transformer';
import { IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator';
import { MAX_MONTH, MAX_YEAR, MIN_MONTH, MIN_YEAR } from '../reading.schema';

export class FilterReadingsDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return [value];

    return value;
  })
  @IsMongoId({ each: true, message: 'Invalid building ID' })
  public buildings?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value) || value;
    }

    return value;
  })
  @IsInt({ message: 'Invalid from year value' })
  @Min(MIN_YEAR, { message: `From year must be greater than ${MIN_YEAR}` })
  @Max(MAX_YEAR, { message: `From year must be less than ${MAX_YEAR}` })
  public fromYear?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value) || value;
    }

    return value;
  })
  @IsInt({ message: 'Invalid from month value' })
  @Min(MIN_MONTH, { message: `From month must be greater than ${MIN_MONTH}` })
  @Max(MAX_MONTH, { message: `From month must be less than ${MAX_MONTH}` })
  public fromMonth?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value) || value;
    }

    return value;
  })
  @IsInt({ message: 'Invalid to year value' })
  @Min(MIN_YEAR, { message: `To year must be greater than ${MIN_YEAR}` })
  @Max(MAX_YEAR, { message: `To year must be less than ${MAX_YEAR}` })
  public toYear?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value) || value;
    }

    return value;
  })
  @IsInt({ message: 'Invalid to month value' })
  @Min(MIN_MONTH, { message: `To month must be greater than ${MIN_MONTH}` })
  @Max(MAX_MONTH, { message: `To month must be less than ${MAX_MONTH}` })
  public toMonth?: number;
}
