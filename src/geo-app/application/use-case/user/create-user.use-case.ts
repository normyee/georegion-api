import { UserDTO } from "../../common/dtos/user.dto";
import { InvalidUserLocationError } from "../../common/errors";
import { IMapper } from "../../common/mappers/user.mapper";
import { User } from "../../../domain/entity/user.entity";
import { ICreateUserRepository } from "../../../infra/database/orm/mongoose/repositories/users/create-user.repository";
import { IGeoLib } from "../../../infra/providers/geo/geo-lib.provider";
import { IAuthProvider } from "../../../../shared/auth.provider";

export class CreateUserUseCase {
  constructor(
    private readonly _createUserRepository: ICreateUserRepository,
    private readonly _geoLib: IGeoLib,
    private readonly _userMapper: IMapper<User, UserDTO>,
    private readonly _authProvider: IAuthProvider
  ) {}
  async execute(data: UserDTO) {
    if (data.address && data.coordinates) throw new InvalidUserLocationError();

    const userModel = this._userMapper.toEntity(data);

    if (data.address) {
      const coordinates = await this._geoLib.getCoordinatesFromAddress(
        data.address
      );

      console.log(coordinates);

      userModel.coordinates = Array.isArray(coordinates)
        ? coordinates
        : [coordinates.lng, coordinates.lat];
    }

    if (data.coordinates) {
      console.log(userModel.address);
      userModel.address = await this._geoLib.getAddressFromCoordinates(
        data.coordinates
      );

      console.log(userModel.address);
    }

    const user = await this._createUserRepository.execute(userModel);

    const token = this._authProvider.tokenize(user.id);

    return { user: this._userMapper.toDTO(user), token };
  }
}
