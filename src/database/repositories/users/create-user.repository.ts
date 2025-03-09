import { getModelForClass } from "@typegoose/typegoose";
import { User } from "../../../models";
import { User as UserEntity } from "../../../entity/user.model";
import mongoose from "mongoose";

export class CreateUserRepositoryMongoAdapter {
  private _user = getModelForClass(User);
  public async execute(data: UserEntity): Promise<any> {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const addedUser = new this._user(
        {
          name: data.name,
          email: data.email,
          address: data.address,
          coordinates: data.coordinates,
        },
        { session }
      );

      await addedUser.save({ session });

      await session.commitTransaction();
      session.endSession();

      return new UserEntity(
        addedUser._id,
        addedUser.name,
        addedUser.email,
        addedUser.address,
        addedUser.coordinates
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}
