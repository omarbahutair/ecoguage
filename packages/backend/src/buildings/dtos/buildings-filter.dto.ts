import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/util/dtos/pagination.dto';

export class BuildingsFilterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  public searchTerm?: string;
}
