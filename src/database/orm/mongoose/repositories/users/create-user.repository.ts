import { User } from "../../../../../entity/user.entity";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.model";

export class CreateUserRepositoryMongoAdapter {
  private _user = UserModel;

  public async execute(data: User): Promise<User> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [addedUser] = await this._user.create(
        [
          {
            name: data.name,
            email: data.email,
            address: data.address,
            coordinates: data.coordinates,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return new User(
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
