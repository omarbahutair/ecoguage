import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Building } from 'src/buildings/building.schema';

export type ReadingDocument = HydratedDocument<Reading>;

export const MIN_YEAR = 2020;
export const MAX_YEAR = new Date().getFullYear();

export const MIN_MONTH = 1;
export const MAX_MONTH = 12;

export const MIN_ENERGY_USAGE = 0;
export const MAX_ENERGY_USAGE = 10_000_000;

export const MIN_ENERGY_COST = 0;
export const MAX_ENERGY_COST = 10_000_000;

@Schema({ timestamps: true })
export class Reading {
  @Prop({ min: MIN_MONTH, max: MAX_MONTH, required: true })
  public month: number;

  @Prop({ min: MIN_YEAR, max: MAX_YEAR, required: true })
  public year: number;

  @Prop({ min: MIN_ENERGY_USAGE, max: MAX_ENERGY_USAGE, required: true })
  public energyUsage: number;

  @Prop({ min: MIN_ENERGY_COST, max: MAX_ENERGY_COST, required: true })
  public energyCost: number;

  @Prop({ type: Types.ObjectId, ref: Building.name })
  public building: Types.ObjectId;
}

export const ReadingSchema = SchemaFactory.createForClass(Reading);

ReadingSchema.index({ month: 1, year: 1, building: 1 }, { unique: true });
