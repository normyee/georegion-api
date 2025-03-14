import { User } from "../../entity/user.entity";

export interface IUpdateUserRepository {
  execute(id: string, data: User): Promise<User>;
}
