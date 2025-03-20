import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  QueryParam,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { UserDTO } from "../../application/common/dtos/user.dto";
import { CreateUserUseCase } from "../../application/use-case/user/create-user.use-case";
import { DeleteUserUseCase } from "../../application/use-case/user/delete-user-use-case";
import { GetAllUsersUseCase } from "../../application/use-case/user/get-all-users.use-case";
import { GetUserUseCase } from "../../application/use-case/user/get-user.use-case";
import { UpdateUserUseCase } from "../../application/use-case/user/update-user.use-case";
import { AuthMiddleware } from "../middlewares/auth-validation.middleware";
import { Response } from "express";
import { InvalidUserLocationError } from "../../application/common/errors";
import { LoggerInstance, TenantRequest } from "../../../shared/types";
import { LoginUserUseCase } from "../../application/use-case/user/login-user.use-case";

@Controller("/users")
export class UserController {
  constructor(
    private _createUserUseCase: CreateUserUseCase,
    private _deleteUserUseCase: DeleteUserUseCase,
    private _getUserUseCase: GetUserUseCase,
    private _getAllUsersUseCase: GetAllUsersUseCase,
    private _updateUserUseCase: UpdateUserUseCase,
    private _logger: LoggerInstance,
    private _loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post("/")
  async create(@Res() res: Response, @Body() data: UserDTO) {
    try {
      const userData = await this._createUserUseCase.execute(data);

      return {
        status: "success",
        message: "User has been created successfully",
        data: userData.user,
        token: userData.token,
      };
    } catch (error) {
      if (error instanceof InvalidUserLocationError) {
        return res.status(400).json({
          status: "failure",
          message: error.message,
        });
      }
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Post("/login")
  async getByEmail(@Res() res: Response, @Body() { email }: { email: string }) {
    try {
      const token = await this._loginUserUseCase.execute(email);

      if (!token) {
        return res.status(404).json({
          status: "failure",
          message: "User's email not found",
        });
      }

      return {
        status: "success",
        message: "User has signed in successfully",
        token,
      };
    } catch (error) {
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Get("/:id")
  @UseBefore(AuthMiddleware)
  async getById(
    @Req() req: TenantRequest,
    @Res() res: Response,
    @Param("id") id: string,
  ) {
    const tenantId = req.tenant.id;

    try {
      const userData = await this._getUserUseCase.execute(id, tenantId);

      if (!userData) {
        return res.status(404).json({
          status: "failure",
          message: "User not found",
        });
      }

      return {
        status: "success",
        message: "User has been fetched successfully",
        data: userData,
      };
    } catch (error) {
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Get("/")
  async getAll(
    @Res() res: Response,
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
  ) {
    try {
      const userData = await this._getAllUsersUseCase.execute(page, limit);

      return {
        status: "success",
        message: "Users have been fetched successfully",
        data: userData,
      };
    } catch (error) {
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Delete("/:id")
  @UseBefore(AuthMiddleware)
  async delete(
    @Req() req: TenantRequest,
    @Res() res: Response,
    @Param("id") id: string,
  ) {
    if (req.tenant.id !== id) {
      return res.status(401).json({
        status: "failure",
        message: "Current user cannot delete this user",
      });
    }

    try {
      const userData = await this._deleteUserUseCase.execute(id);

      if (!userData) {
        return res.status(404).json({
          status: "failure",
          message: "User not found",
        });
      }

      return {
        status: "success",
        message: "User has been deleted successfully",
        data: userData,
      };
    } catch (error) {
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Patch("/:id")
  @UseBefore(AuthMiddleware)
  async update(
    @Req() req: TenantRequest,
    @Res() res: Response,
    @Param("id") id: string,
    @Body() data: UserDTO,
  ) {
    const tenantId = req.tenant.id;

    try {
      if (tenantId !== id) {
        return res.status(401).json({
          status: "failure",
          message: "This token is not associated with the fetched id",
        });
      }

      const userData = await this._updateUserUseCase.execute(id, data);

      if (!userData) {
        return res.status(404).json({
          status: "failure",
          message: "User not found",
        });
      }

      return {
        status: "success",
        message: "User has been updated successfully",
        data: userData,
      };
    } catch (error) {
      if (error instanceof InvalidUserLocationError) {
        return res.status(400).json({
          status: "failure",
          message: error.message,
        });
      }
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }
}
