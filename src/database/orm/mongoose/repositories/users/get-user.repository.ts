import { User } from "../../../../../entity/user.entity";
import { UserModel } from "../../models/user.model";

export class GetUserRepositoryMongoAdapter {
  private _user = UserModel;

  public async execute(data: User): Promise<User> {
    const foundUser = await this._user.findOne({ _id: data.id }).exec();

    if (!foundUser) {
      throw new Error("User not found");
    }

    return new User(
      foundUser._id,
      foundUser.name,
      foundUser.email,
      foundUser.address,
      foundUser.coordinates
    );
  }
}
