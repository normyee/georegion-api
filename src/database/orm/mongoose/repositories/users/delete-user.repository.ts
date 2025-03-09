import { User } from "../../../../../entity/user.entity";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.model";

export class DeleteUserRepositoryMongoAdapter {
  private _user = UserModel;
  public async execute(data: User): Promise<User> {
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

      return new User(
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
