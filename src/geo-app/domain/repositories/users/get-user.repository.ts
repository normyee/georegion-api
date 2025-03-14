import { User } from "../../entity/user.entity";

export interface IGetUserRepository {
  execute(id: string, tenantId: string): Promise<User>;
}
