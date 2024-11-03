import { IsOptional, IsString } from 'class-validator';

export class SearchTermDto {
  @IsOptional()
  @IsString()
  public searchTerm?: string;
}
