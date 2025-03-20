import { User } from "../../entity/user.entity";

export interface ICreateUserRepository {
  execute(data: User): Promise<User>;
}
