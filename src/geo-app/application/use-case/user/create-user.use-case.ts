import { UserDTO } from "../../common/dtos/user.dto";
import { InvalidUserLocationError } from "../../common/errors";
import { User } from "../../../domain/entity/user.entity";
import { IMapper } from "../../../domain/common/mapper.interface";
import { ICreateUserRepository } from "../../../domain/repositories/users/create-user.repository";
import { IAuthProvider } from "../../../../shared/types";
import { IGeoLib } from "../../abstractions/geo-lib.interface";

export class CreateUserUseCase {
  constructor(
    private readonly _createUserRepository: ICreateUserRepository,
    private readonly _geoLib: IGeoLib,
    private readonly _userMapper: IMapper<User, UserDTO>,
    private readonly _authProvider: IAuthProvider,
  ) {}
  async execute(data: UserDTO) {
    if (data.address && data.coordinates) throw new InvalidUserLocationError();

    const userModel = this._userMapper.toEntity(data);

    if (data.address) {
      const coordinates = await this._geoLib.getCoordinatesFromAddress(
        data.address,
      );

      userModel.coordinates = Array.isArray(coordinates)
        ? coordinates
        : [coordinates.lng, coordinates.lat];
    }

    if (data.coordinates) {
      userModel.address = await this._geoLib.getAddressFromCoordinates(
        data.coordinates,
      );
    }

    const user = await this._createUserRepository.execute(userModel);

    const token = this._authProvider.tokenize(user.id);

    return { user: this._userMapper.toDTO(user), token };
  }
}
