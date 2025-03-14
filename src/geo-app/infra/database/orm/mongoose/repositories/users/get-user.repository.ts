import { User } from "../../../../../../domain/entity/user.entity";
import { UserModel } from "../../models/user.model";

export interface IGetUserRepository {
  execute(id: string, tenantId: string): Promise<User>;
}

export class GetUserRepositoryMongoAdapter implements IGetUserRepository {
  private _user = UserModel;

  public async execute(id: string, tenantId: string): Promise<User> {
    const foundUser = await this._user.findOne({ _id: id }).exec();

    if (!foundUser) {
      return null;
    }

    if (id !== tenantId) {
      foundUser.email = "########";
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
