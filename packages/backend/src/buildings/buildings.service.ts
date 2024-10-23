import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Building } from './building.schema';
import { Model } from 'mongoose';
import { CreateBuildingDto } from './dtos/create-building.dto';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class BuildingsService {
  public constructor(
    @InjectModel(Building.name) private readonly buildingModel: Model<Building>,
  ) {}

  public async create(createBuilding: CreateBuildingDto, user: UserDocument) {
    return this.buildingModel.create({
      ...createBuilding,
      userId: user._id,
    });
  }
}
