import { IDeleteUserRepository } from "../../../domain/repositories/users/delete-user.repository";

export class DeleteUserUseCase {
  constructor(private readonly _deleteUserRepository: IDeleteUserRepository) {}

  async execute(id: string) {
    return await this._deleteUserRepository.execute(id);
  }
}
