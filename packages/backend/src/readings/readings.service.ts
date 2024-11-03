import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reading, ReadingDocument } from './reading.schema';
import { Model, Types } from 'mongoose';
import { UpsertReadingDto } from './dtos/upsert-reading.dto';
import { UserDocument } from 'src/users/user.schema';
import { BuildingsService } from 'src/buildings/buildings.service';

@Injectable()
export class ReadingsService {
  public constructor(
    @InjectModel(Reading.name)
    private readonly readingModel: Model<ReadingDocument>,
    private readonly buildingsService: BuildingsService,
  ) {}

  public async create(
    createReading: UpsertReadingDto,
    user: UserDocument,
  ): Promise<ReadingDocument> {
    // validate and authorize building
    await this.buildingsService.findOne(createReading.building, user);

    const newReading: Reading = {
      ...createReading,
      building: new Types.ObjectId(createReading.building),
    };

    // check for repeated year, month, and building
    const doesReadingExist = await this.readingModel.findOne({
      year: newReading.year,
      month: newReading.month,
      building: newReading.building,
    });

    if (doesReadingExist)
      throw new BadRequestException(
        'A reading for this year and month already exists. Please modify or delete the existing entry',
      );

    return this.readingModel.create(newReading);
  }
}
