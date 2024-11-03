import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Building, BuildingDocument } from './building.schema';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { BuildingsFilterDto } from './dtos/buildings-filter.dto';
import { cleanRegex } from 'src/util/functions/cleanRegex';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Reading } from 'src/readings/reading.schema';

@Injectable()
export class ManageDeletedBuildingsService {
  public constructor(
    @InjectModel(Building.name) private readonly buildingModel: Model<Building>,
    @InjectModel(Reading.name) private readonly readingModel: Model<Reading>,
  ) {}

  public async findDeleted(
    { page = 0, pageSize = 50, searchTerm }: BuildingsFilterDto,
    user: UserDocument,
  ): Promise<PaginatedResponse<BuildingDocument>> {
    const query: FilterQuery<Building> = { userId: user._id, isDeleted: true };

    if (searchTerm) {
      query.name = {
        $regex: cleanRegex(searchTerm),
        $options: 'i',
      };
    }

    return {
      data: await this.buildingModel
        .find(query)
        .skip(page * pageSize)
        .limit(pageSize),
      metadata: {
        count: await this.buildingModel.countDocuments(query),
      },
    };
  }

  public async recoverDeleted(
    id: string,
    user: UserDocument,
  ): Promise<BuildingDocument> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid building ID');

    const updatedBuilding = await this.buildingModel.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
        isDeleted: true,
      },
      {
        isDeleted: false,
        $unset: {
          deletedAt: '',
        },
      },
      { new: true },
    );

    if (!updatedBuilding) throw new NotFoundException('Building not found');

    return updatedBuilding;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async manageDeleted(): Promise<void> {
    const findDeletedBuildingsQuery: FilterQuery<Building> = {
      isDeleted: true,
      deletedAt: {
        $lt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    };

    const buildingsIds = (
      await this.buildingModel.find(findDeletedBuildingsQuery)
    ).map((b) => b._id);

    await Promise.all([
      this.buildingModel.deleteMany(findDeletedBuildingsQuery),
      this.readingModel.deleteMany({
        building: { $in: buildingsIds },
      }),
    ]);
  }
}
