import { Module } from '@nestjs/common';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Building, BuildingSchema } from './building.schema';
import { ManageDeletedBuildingsController } from './manage-deleted-buildings.controller';
import { ManageDeletedBuildingsService } from './manage-deleted-buildings.service';
import { Reading, ReadingSchema } from 'src/readings/reading.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Building.name,
        schema: BuildingSchema,
      },
      {
        name: Reading.name,
        schema: ReadingSchema,
      },
    ]),
  ],
  controllers: [BuildingsController, ManageDeletedBuildingsController],
  providers: [BuildingsService, ManageDeletedBuildingsService],
  exports: [BuildingsService],
})
export class BuildingsModule {}
