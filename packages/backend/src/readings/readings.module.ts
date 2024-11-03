import { Module } from '@nestjs/common';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reading, ReadingSchema } from './reading.schema';
import { BuildingsModule } from 'src/buildings/buildings.module';
import { Building, BuildingSchema } from 'src/buildings/building.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reading.name,
        schema: ReadingSchema,
      },
      {
        name: Building.name,
        schema: BuildingSchema,
      },
    ]),
    BuildingsModule,
  ],
  controllers: [ReadingsController],
  providers: [ReadingsService],
})
export class ReadingsModule {}
