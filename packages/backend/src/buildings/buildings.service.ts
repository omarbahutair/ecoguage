import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Building, BuildingDocument } from './building.schema';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { UpsertBuildingDto } from './dtos/upsert-building.dto';
import { UserDocument } from 'src/users/user.schema';
import { PaginationDto } from 'src/util/dtos/pagination.dto';

@Injectable()
export class BuildingsService {
  public constructor(
    @InjectModel(Building.name) private readonly buildingModel: Model<Building>,
  ) {}

  public async create(
    createBuilding: UpsertBuildingDto,
    user: UserDocument,
  ): Promise<BuildingDocument> {
    return this.buildingModel.create({
      ...createBuilding,
      userId: user._id,
    });
  }

  public async update(
    id: string,
    updateBuilding: UpsertBuildingDto,
    user: UserDocument,
  ): Promise<BuildingDocument> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid building ID');

    const updatedBuilding = await this.buildingModel.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
      },
      updateBuilding,
      { new: true },
    );

    if (!updatedBuilding) throw new NotFoundException('Building not found');

    return updatedBuilding;
  }

  public async findOne(
    id: string,
    user: UserDocument,
  ): Promise<BuildingDocument> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid building ID');

    const building = await this.buildingModel.findOne({
      _id: id,
      userId: user._id,
    });

    if (!building) throw new NotFoundException('Building not found');

    return building;
  }

  public async find(
    { page = 0, pageSize = 50 }: PaginationDto,
    user: UserDocument,
  ): Promise<PaginatedResponse<BuildingDocument>> {
    const query: FilterQuery<UserDocument> = { userId: user._id };

    return {
      data: await this.buildingModel
        .find()
        .skip(page * pageSize)
        .limit(pageSize),
      metadata: {
        count: await this.buildingModel.countDocuments(query),
      },
    };
  }
}
