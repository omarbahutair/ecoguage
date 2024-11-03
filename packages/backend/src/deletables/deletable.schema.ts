import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Deletable {
  @Prop({ required: true, default: false })
  public isDeleted: boolean;

  @Prop()
  public deletedAt?: Date;
}
