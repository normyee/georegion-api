import { Body, Controller, Delete, Get, Param, Patch, Post, QueryParam } from "routing-controllers";
import { UserDTO } from "../../application/common/dtos/user.dto";
import { CreateUserUseCase } from "../../application/use-case/user/create-user.use-case";
import { DeleteUserUseCase } from "../../application/use-case/user/delete-user-use-case";
import { GetAllUsersUseCase } from "../../application/use-case/user/get-all-users.use-case";
import { GetUserUseCase } from "../../application/use-case/user/get-user.use-case";
import { UpdateUserUseCase } from "../../application/use-case/user/update-user.use-case";

@Controller("/users")
export class UserController {
  constructor(
    private _createUserUseCase: CreateUserUseCase,
    private _deleteUserUseCase: DeleteUserUseCase,
    private _getUserUseCase: GetUserUseCase,
    private _getAllUsersUseCase: GetAllUsersUseCase,
    private _updateUserUseCase: UpdateUserUseCase
  ) {}

  @Post("/")
  async create(@Body() data: UserDTO) {
    return await this._createUserUseCase.execute(data);
  }

  @Get("/:id")
  async getById(@Param("id") id: string) {
    return await this._getUserUseCase.execute(id);
  }

  @Get("/")
  async getAll(
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number
  ) {
    return await this._getAllUsersUseCase.execute(page, limit);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    return await this._deleteUserUseCase.execute(id);
  }

  @Patch("/:id")
  async update(@Param("id") id: string, @Body() data: UserDTO) {
    return await this._updateUserUseCase.execute(id, data);
  }
}