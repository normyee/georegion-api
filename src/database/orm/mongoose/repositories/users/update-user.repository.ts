import { getModelForClass } from "@typegoose/typegoose";
import { User } from "../../models/models";
import { User as UserEntity } from "../../../../../entity/user.model";
import mongoose from "mongoose";

export class UpdateUserRepositoryMongoAdapter {
  private _user = getModelForClass(User);

  public async execute(data: UserEntity): Promise<UserEntity> {
    const session = await mongoose.startSession();
    let updatedUser = null;

    session.startTransaction();

    try {
      updatedUser = await this._user
        .findOneAndUpdate({ _id: data.id }, data, {
          new: true,
          session,
        })
        .exec();

      if (!updatedUser) {
        throw new Error("User not found");
      }

      await session.commitTransaction();
      session.endSession();

      return new UserEntity(
        updatedUser._id,
        updatedUser.name,
        updatedUser.email,
        updatedUser.address,
        updatedUser.coordinates
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}
