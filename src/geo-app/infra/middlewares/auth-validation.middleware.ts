import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { AuthProvider } from "../../../shared/auth.provider";

const authProvider = new AuthProvider();

export interface TenantRequest extends Request {
  tenant?: { id: string };
}

export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: TenantRequest, res: Response, next: NextFunction): any {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ status: "failure", message: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = authProvider.validate(token);

    if (!decoded) {
      return res
        .status(401)
        .json({ status: "failure", message: "Invalid token" });
    }

    req.tenant = { id: decoded.userId };
    next();
  }
}
