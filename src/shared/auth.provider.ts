import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { DecodedToken, IAuthProvider, LoggerInstance } from "./types";
dotenv.config();

const SECRET = process.env.SECRET;

export class AuthProvider implements IAuthProvider {
  constructor(private readonly _logger: LoggerInstance) {
  }

  tokenize(userId: string): string {
    return jwt.sign({ userId }, SECRET, { expiresIn: "5h" });
  }

  validate(token: string): DecodedToken | null {
    try {
      return jwt.verify(token, SECRET) as DecodedToken;
    } catch (error) {
      this._logger.warn("Input token not valid", error);
      return null;
    }
  }
}
