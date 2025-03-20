import { User } from "../../entity/user.entity";

export interface IGetAllUsersRepository {
    execute(page: number, limit: number): Promise<User[]>;
  }