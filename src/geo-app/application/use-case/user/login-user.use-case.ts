import { IAuthProvider } from "../../../../shared/types";
import { IGetUserByEmailRepository } from "../../../domain/repositories/users/get-user-by-email.repository";

export class LoginUserUseCase {
  constructor(
    private readonly _getUserByEmailRepository: IGetUserByEmailRepository,
    private readonly _authProvider: IAuthProvider,
  ) {}

  async execute(email: string) {
    const user = await this._getUserByEmailRepository.execute(email);

    if (!user) return null;

    const token = this._authProvider.tokenize(user.id);

    return token;
  }
}
