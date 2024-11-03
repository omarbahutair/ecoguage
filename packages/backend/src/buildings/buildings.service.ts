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
import { BuildingsFilterDto } from './dtos/buildings-filter.dto';
import { cleanRegex } from 'src/util/functions/cleanRegex';

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
      isDeleted: false,
    });
  }

  public async update(
    id: string,
    buildingUpdate: UpsertBuildingDto,
    user: UserDocument,
  ): Promise<BuildingDocument> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid building ID');

    const updatedBuilding = await this.buildingModel.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
        isDeleted: false,
      },
      buildingUpdate,
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
      isDeleted: false,
    });

    if (!building) throw new NotFoundException('Building not found');

    return building;
  }

  public async find(
    { page = 0, pageSize = 50, searchTerm }: BuildingsFilterDto,
    user: UserDocument,
  ): Promise<PaginatedResponse<BuildingDocument>> {
    const query: FilterQuery<BuildingDocument> = {
      userId: user._id,
      isDeleted: false,
    };

    console.log(searchTerm);
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

  public async softDelete(
    id: string,
    user: UserDocument,
  ): Promise<BuildingDocument> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid building ID');

    const deletedBuilding = await this.buildingModel.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    );

    if (!deletedBuilding) throw new NotFoundException('Building not found');

    return deletedBuilding;
  }

  public async delete(
    id: string,
    user: UserDocument,
  ): Promise<BuildingDocument> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid building ID');

    const deletedBuilding = await this.buildingModel.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!deletedBuilding) throw new NotFoundException('Building not found');

    return deletedBuilding;
  }
}
