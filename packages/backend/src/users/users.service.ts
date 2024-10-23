import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public create(user: User): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  public findById(id: string): Promise<UserDocument | null> {
    if (!isValidObjectId(id)) return null;

    return this.userModel.findById(id);
  }

  public findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  public update(id: string, user: User): Promise<UserDocument | null> {
    if (!isValidObjectId(id)) return null;

    return this.userModel.findByIdAndUpdate(id, user);
  }
}
