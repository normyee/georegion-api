import { Response, NextFunction } from "express";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { IAuthProvider, TenantRequest } from "../../../shared/types";

export class AuthMiddleware implements ExpressMiddlewareInterface {
  constructor(private readonly _authProvider: IAuthProvider) {}
  use(req: TenantRequest, res: Response, next: NextFunction): Response | void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ status: "failure", message: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = this._authProvider.validate(token);

    if (!decoded) {
      return res
        .status(401)
        .json({ status: "failure", message: "Invalid token" });
    }

    req.tenant = { id: decoded.userId };
    next();
  }
}
