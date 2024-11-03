import { Expose } from 'class-transformer';

export class BuildingDto {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public createdAt: Date;

  @Expose()
  public updatedAt: Date;

  @Expose()
  public deletedAt: Date;
}
