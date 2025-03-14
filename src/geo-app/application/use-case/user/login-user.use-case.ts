import { IAuthProvider } from "../../../../shared/types";
import { IGetUserByEmailRepository } from "../../../domain/repositories/users/get-user-by-email.repository";

export class LoginUserUseCase {
  constructor(
    private readonly _getUserByEmailRepository: IGetUserByEmailRepository,
    private readonly _authProvider: IAuthProvider,
  ) {}

  async execute(email: string) {
    console.log("passei 1 app");
    const user = await this._getUserByEmailRepository.execute(email);

    console.log("passei 2 app");

    if (!user) return null;

    console.log("passei 3 app");

    const token = this._authProvider.tokenize(user.id);
    console.log("passei 4 app");

    return token;
  }
}
