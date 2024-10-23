import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Building } from './building.schema';
import { isValidObjectId, Model } from 'mongoose';
import { UpsertBuildingDto } from './dtos/upsert-building.dto';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class BuildingsService {
  public constructor(
    @InjectModel(Building.name) private readonly buildingModel: Model<Building>,
  ) {}

  public async create(createBuilding: UpsertBuildingDto, user: UserDocument) {
    return this.buildingModel.create({
      ...createBuilding,
      userId: user._id,
    });
  }

  public async update(
    id: string,
    updateBuilding: UpsertBuildingDto,
    user: UserDocument,
  ) {
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

    if (!updateBuilding) throw new NotFoundException('Building not found');

    return updatedBuilding;
  }
}
