import { IsString, MinLength } from 'class-validator';

export class UpsertBuildingDto {
  @IsString({ message: 'Invalid building name' })
  @MinLength(1, { message: 'Building name is required' })
  public name: string;
}
