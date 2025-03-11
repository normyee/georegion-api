import { UserDTO } from "../../common/dtos/user.dto";
import { InvalidUserLocationError } from "../../common/errors";
import { IMapper } from "../../common/mappers/user.mapper";
import { User } from "../../../domain/entity/user.entity";
import { IUpdateUserRepository } from "../../../infra/database/orm/mongoose/repositories/users/update-user.repository";
import { IGeoLib } from "../../../infra/providers/geo/geo-lib.provider";

export class UpdateUserUseCase {
  constructor(
    private readonly _updateUserRepository: IUpdateUserRepository,
    private readonly _userMapper: IMapper<User, UserDTO>,
    private readonly _geoLib: IGeoLib
  ) {}

  async execute(id: string, data: UserDTO) {
    if (data.address && data.coordinates)
      throw new InvalidUserLocationError(
        "Cannot update both address and coordinates"
      );

    const userModel = this._userMapper.toEntity(data);

    if (data.address) {
      const coordinates = await this._geoLib.getCoordinatesFromAddress(
        data.address
      );

      userModel.coordinates = Array.isArray(coordinates)
        ? coordinates
        : [coordinates.lng, coordinates.lat];
    }

    if (data.coordinates) {
      userModel.address = await this._geoLib.getAddressFromCoordinates(
        data.coordinates
      );
    }

    const updatedUser = await this._updateUserRepository.execute(id, userModel);

    return this._userMapper.toDTO(updatedUser);
  }
}
