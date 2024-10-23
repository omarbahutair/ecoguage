import { Module } from '@nestjs/common';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Building, BuildingSchema } from './building.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Building.name,
        schema: BuildingSchema,
      },
    ]),
  ],
  controllers: [BuildingsController],
  providers: [BuildingsService],
})
export class BuildingsModule {}
