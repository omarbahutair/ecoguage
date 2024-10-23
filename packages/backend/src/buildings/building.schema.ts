import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/user.schema';

export type BuildingDocument = HydratedDocument<Building>;

@Schema({ timestamps: true })
export class Building {
  @Prop({ required: true })
  public name: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  public userId: Types.ObjectId;
}

export const BuildingSchema = SchemaFactory.createForClass(Building);
