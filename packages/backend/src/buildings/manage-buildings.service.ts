import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Building, BuildingDocument } from './building.schema';
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { PaginationDto } from 'src/util/dtos/pagination.dto';
import { BuildingsFilterDto } from './dtos/buildings-filter.dto';

@Injectable()
export class ManageBuildingsService {
  public constructor(
    @InjectModel(Building.name) private readonly buildingModel: Model<Building>,
  ) {}

  public async create(building: Building): Promise<BuildingDocument> {
    return this.buildingModel.create(building);
  }

  public async findOneAndUpdate(
    filter: FilterQuery<Building>,
    buildingUpdate: UpdateQuery<Building>,
    options: QueryOptions,
  ) {
    const session = await this.buildingModel.startSession();

    session.startTransaction();

    const updatedBuilding = await this.buildingModel.findOneAndUpdate(
      filter,
      buildingUpdate,
      { ...options, session },
    );

    if (updatedBuilding.isDeleted) {
      await session.abortTransaction();
      await session.endSession();

      return null;
    }

    await session.commitTransaction();

    return updatedBuilding;
  }

  public async find(
    filter: FilterQuery<BuildingDocument>,
    page = 0,
    pageSize = 50,
  ) {
    return this.buildingModel
      .find({
        ...filter,
        isDeleted: false,
      })
      .skip(page * pageSize);
  }
}
