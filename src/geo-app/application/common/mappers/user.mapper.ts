import { IMapper } from "../../../domain/common/mapper.interface";
import { User } from "../../../domain/entity/user.entity";
import { UserDTO } from "../dtos/user.dto";

export class UserMapper implements IMapper<User, UserDTO> {
  toDTO(user: User): UserDTO {
    return {
      id: user.id || null,
      name: user.name,
      email: user.email,
      address: user.address,
      coordinates: user.coordinates,
    };
  }

  toEntity(data: UserDTO, id?: string): User {
    return new User(
      id || null,
      data.name,
      data.email,
      data.address,
      data.coordinates
    );
  }
}
