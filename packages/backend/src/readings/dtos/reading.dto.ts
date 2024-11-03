import { Expose, Type } from 'class-transformer';
import { BuildingDto } from 'src/buildings/dtos/building.dto';
import { ExposeId } from 'src/util/decorators/expose-id.decorator';

export class ReadingDto {
  @Expose()
  public id: string;

  @ExposeId()
  @Type(() => BuildingDto)
  public building: BuildingDto | string;

  @Expose()
  public month: number;

  @Expose()
  public year: number;

  @Expose()
  public energyUsage: number;

  @Expose()
  public energyCost: number;
}
