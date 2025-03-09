import { getModelForClass } from "@typegoose/typegoose";
import { User } from "../../../models";
import { User as UserEntity } from "../../../entity/user.model";
import mongoose from "mongoose";

export class DeleteUserRepositoryMongoAdapter {
  private _user = getModelForClass(User);
  public async execute(data: UserEntity): Promise<UserEntity> {
    const session = await mongoose.startSession();
    let deletedUser = null;

    session.startTransaction();

    try {
      deletedUser = await this._user
        .findOneAndDelete({ _id: data.id })
        .session(session);

      if (!deletedUser) {
        throw new Error("User was not found");
      }

      await session.commitTransaction();
      session.endSession();

      return new UserEntity(
        deletedUser._id,
        deletedUser.name,
        deletedUser.email,
        deletedUser.address,
        deletedUser.coordinates
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}
