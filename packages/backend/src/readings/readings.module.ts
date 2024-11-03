import { Module } from '@nestjs/common';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reading, ReadingSchema } from './reading.schema';
import { BuildingsModule } from 'src/buildings/buildings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reading.name,
        schema: ReadingSchema,
      },
    ]),
    BuildingsModule,
  ],
  controllers: [ReadingsController],
  providers: [ReadingsService],
})
export class ReadingsModule {}
