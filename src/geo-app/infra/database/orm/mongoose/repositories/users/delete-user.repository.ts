import { User } from "../../../../../../domain/entity/user.entity";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.model";
import { RegionModel } from "../../models/region.model";

export interface IDeleteUserRepository {
  execute(id: string): Promise<User>;
}

export class DeleteUserRepositoryMongoAdapter implements IDeleteUserRepository {
  private _user = UserModel;
  private _region = RegionModel;
  public async execute(id: string): Promise<User> {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const deletedUser = await this._user
        .findOneAndDelete({ _id: id })
        .session(session);

      if (!deletedUser) {
        await session.abortTransaction();
        session.endSession();
        return null;
      }

      await this._region.deleteMany({ user: deletedUser._id }).session(session);

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
