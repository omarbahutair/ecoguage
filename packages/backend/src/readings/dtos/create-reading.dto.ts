import { IsMongoId } from 'class-validator';

import { UpdateReadingDto } from './update-reading.dto';

export class CreateReadingDto extends UpdateReadingDto {
  @IsMongoId({ message: 'Invalid building' })
  public building: string;
}
