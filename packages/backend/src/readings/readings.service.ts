import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reading, ReadingDocument } from './reading.schema';
import { FilterQuery, isValidObjectId, Model, Types } from 'mongoose';
import { CreateReadingDto } from './dtos/create-reading.dto';
import { UserDocument } from 'src/users/user.schema';
import { BuildingsService } from 'src/buildings/buildings.service';
import { FilterReadingsDto } from './dtos/filter-readings.dto';
import { Building, BuildingDocument } from 'src/buildings/building.schema';
import { UpdateReadingDto } from './dtos/update-reading.dto';

@Injectable()
export class ReadingsService {
  public constructor(
    @InjectModel(Reading.name)
    private readonly readingModel: Model<ReadingDocument>,
    @InjectModel(Building.name)
    private readonly buildingModel: Model<BuildingDocument>,
    private readonly buildingsService: BuildingsService,
  ) {}

  public async create(
    createReading: CreateReadingDto,
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

  public async find(
    filter: FilterReadingsDto,
    user: UserDocument,
  ): Promise<ReadingDocument[]> {
    const buildingsIds = (
      await this.buildingModel.find(
        {
          userId: user._id,
        },
        '_id',
      )
    ).map((b) => b._id.toString());

    const query: FilterQuery<Reading> = {};

    if (filter.buildings) {
      query.building = {
        $in: filter.buildings
          .filter((b) => buildingsIds.includes(b))
          .map((b) => new Types.ObjectId(b)),
      };
    } else {
      query.building = {
        $in: buildingsIds.map((b) => new Types.ObjectId(b)),
      };
    }

    if (filter.fromMonth !== undefined && filter.fromYear !== undefined) {
      query.month = {
        $gte: filter.fromMonth,
      };

      query.year = {
        $gte: filter.fromYear,
      };
    }

    if (filter.toMonth !== undefined && filter.toYear !== undefined) {
      query.month = {
        ...(query.month ?? {}),
        $lte: filter.toMonth,
      };

      query.year = {
        ...(query.year ?? {}),
        $lte: filter.toYear,
      };
    }

    return this.readingModel
      .find(query)
      .populate('building')
      .sort({ year: 1, month: 1 });
  }

  public async update(
    id: string,
    updateReading: UpdateReadingDto,
    user: UserDocument,
  ): Promise<ReadingDocument> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid reading ID');

    const oldReading = await this.readingModel.findById(id);

    if (!oldReading) throw new NotFoundException('Reading not found');

    // authorize user's access to building
    await this.buildingsService.findOne(oldReading.building.toString(), user);

    // check for repeated year, month, and building
    const doesReadingExist = await this.readingModel.findOne({
      _id: { $ne: oldReading._id },
      year: updateReading.year,
      month: updateReading.month,
      building: oldReading.building,
    });

    if (doesReadingExist)
      throw new BadRequestException(
        'A reading for this year and month already exists. Please modify or delete the existing entry',
      );

    const updatedReading = await this.readingModel.findByIdAndUpdate(
      id,
      updateReading,
      { new: true },
    );

    if (!updatedReading) throw new NotFoundException('Reading not found');

    return updatedReading;
  }
}
