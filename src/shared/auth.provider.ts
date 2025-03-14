import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET;

export interface IAuthProvider {
  tokenize(userId: string): string;
  validate(token: string): any | null;
}

export class AuthProvider implements IAuthProvider {
  tokenize(userId: string): string {
    return jwt.sign({ userId }, SECRET, { expiresIn: "5h" });
  }

  validate(token: string): any | null {
    try {
      return jwt.verify(token, SECRET);
    } catch (err) {
      return null;
    }
  }
}
