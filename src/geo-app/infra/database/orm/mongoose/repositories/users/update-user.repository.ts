import { User } from "../../../../../../domain/entity/user.entity";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.model";
import { IUpdateUserRepository } from "../../../../../../domain/repositories/users/update-user.repository";

export class UpdateUserRepositoryMongoAdapter implements IUpdateUserRepository {
  private _user = UserModel;

  public async execute(id: string, data: User): Promise<User> {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const updatedUser = await this._user
        .findOneAndUpdate(
          { _id: id },
          {
            name: data.name,
            email: data.email,
            address: data.address,
            coordinates: data.coordinates,
          },
          {
            new: true,
            session,
          }
        )
        .exec();

      if (!updatedUser) {
        await session.abortTransaction();
        session.endSession();
        return null;
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
