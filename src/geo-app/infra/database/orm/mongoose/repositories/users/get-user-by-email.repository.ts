import { User } from "../../../../../../domain/entity/user.entity";
import { IGetUserByEmailRepository } from "../../../../../../domain/repositories/users/get-user-by-email.repository";
import { UserModel } from "../../models/user.model";

export class GetUserByEmailRepositoryMongoAdapter
  implements IGetUserByEmailRepository
{
  private _user = UserModel;

  public async execute(email: string): Promise<User> {
    const foundUser = await this._user.findOne({ email: email }).exec();

    if (!foundUser) {
      return null;
    }

    return new User(
      foundUser._id,
      foundUser.name,
      foundUser.email,
      foundUser.address,
      foundUser.coordinates,
    );
  }
}
