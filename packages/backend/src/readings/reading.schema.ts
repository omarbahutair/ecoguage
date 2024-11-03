import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReadingDocument = HydratedDocument<Reading>;

@Schema({ timestamps: true })
export class Reading {
  @Prop({ min: 1, max: 12, required: true })
  public month: number;

  @Prop({ min: 2020, max: 2024, required: true })
  public year: number;

  @Prop({ min: 0, max: 10_000_000, required: true })
  public energyUsage: number;

  @Prop({ min: 0, max: 10_000_000, required: true })
  public energyCost: number;
}

export const ReadingSchema = SchemaFactory.createForClass(Reading);
