import { IGetAllUsersRepository } from "../../../infra/database/orm/mongoose/repositories/users/get-all-users.repository";

export class GetAllUsersUseCase {
  constructor(
    private readonly _getAllUsersRepository: IGetAllUsersRepository
  ) {}

  async execute(page: number, limit: number) {
    return await this._getAllUsersRepository.execute(page, limit);
  }
}
