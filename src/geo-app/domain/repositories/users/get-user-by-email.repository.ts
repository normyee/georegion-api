import { User } from "../../entity/user.entity";

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<User>;
}
