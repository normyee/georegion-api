import { User } from "../../../../../entity/user.entity";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.model";

export class UpdateUserRepositoryMongoAdapter {
  private _user = UserModel;

  public async execute(data: User): Promise<User> {
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

      return new User(
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
