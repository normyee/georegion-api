import { User } from "../../entity/user.entity";

export interface IDeleteUserRepository {
  execute(id: string): Promise<User>;
}
