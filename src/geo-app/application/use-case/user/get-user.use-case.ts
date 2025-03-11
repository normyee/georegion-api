import { IGetUserRepository } from "../../../infra/database/orm/mongoose/repositories/users/get-user.repository";

export class GetUserUseCase {
  constructor(private readonly _getUserRepository: IGetUserRepository) {}

  async execute(id: string) {
    return await this._getUserRepository.execute(id);
  }
}
