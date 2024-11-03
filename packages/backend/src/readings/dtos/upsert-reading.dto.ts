import { IsInt, IsMongoId, Max, Min } from 'class-validator';
import {
  MAX_ENERGY_COST,
  MAX_ENERGY_USAGE,
  MAX_MONTH,
  MAX_YEAR,
  MIN_ENERGY_COST,
  MIN_ENERGY_USAGE,
  MIN_MONTH,
  MIN_YEAR,
} from '../reading.schema';

export class UpsertReadingDto {
  @IsInt({ message: 'Invalid year' })
  @Min(MIN_YEAR, { message: `Year must be greater than ${MIN_YEAR}` })
  @Max(MAX_YEAR, { message: `Year must be less than ${MAX_YEAR}` })
  public year: number;

  @IsInt({ message: 'Invalid month' })
  @Min(MIN_MONTH, { message: `Month must be greater than ${MIN_MONTH}` })
  @Max(MAX_MONTH, { message: `Month must be less than ${MAX_MONTH}` })
  public month: number;

  @IsInt({ message: 'Invalid energy usage' })
  @Min(MIN_ENERGY_USAGE, {
    message: `Energy usage must be greater than ${MIN_ENERGY_USAGE}`,
  })
  @Max(MAX_ENERGY_USAGE, {
    message: `Energy usage must be less than ${MAX_ENERGY_USAGE}`,
  })
  public energyUsage: number;

  @IsInt({ message: 'Invalid energy cost' })
  @Min(MIN_ENERGY_COST, {
    message: `Energy cost must be greater than ${MIN_ENERGY_COST}`,
  })
  @Max(MAX_ENERGY_COST, {
    message: `Energy cost must be less than ${MAX_ENERGY_COST}`,
  })
  public energyCost: number;

  @IsMongoId({ message: 'Invalid building' })
  public building: string;
}
