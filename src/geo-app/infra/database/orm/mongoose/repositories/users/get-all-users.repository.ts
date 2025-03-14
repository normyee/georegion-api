import { User } from "../../../../../../domain/entity/user.entity";
import { UserModel } from "../../models/user.model";

export interface IGetAllUsersRepository {
  execute(page: number, limit: number): Promise<User[]>;
}

export class GetAllUsersRepositoryMongoAdapter
  implements IGetAllUsersRepository
{
  private _user = UserModel;

  public async execute(page: number = 1, limit: number = 10): Promise<User[]> {
    const users = await this._user
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return users.map(
      (user) =>
        new User(
          user._id,
          user.name,
          "#############",
          user.address,
          user.coordinates
        )
    );
  }
}
