import { getModelForClass } from "@typegoose/typegoose";
import { User } from "../../../models";
import { User as UserEntity } from "../../../entity/user.model";

export class GetUserRepositoryMongoAdapter {
  private _user = getModelForClass(User);

  public async execute(data: UserEntity): Promise<UserEntity> {
    const foundUser = await this._user.findOne({ _id: data.id }).exec();

    if (!foundUser) {
      throw new Error("User not found");
    }

    return new UserEntity(
      foundUser._id,
      foundUser.name,
      foundUser.email,
      foundUser.address,
      foundUser.coordinates
    );
  }
}
