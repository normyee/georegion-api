import { MissingItemError } from "../../common/errors";
import { IMapper } from "../../common/mappers/user.mapper";
import { ICreateRegionRepository } from "../../../infra/database/orm/mongoose/repositories/regions/create-region.repository";
import { Region } from "../../../domain/entity/region.entity";
import { RegionDTO } from "../../common/dtos/region.dto";

export class CreateRegionUseCase {
  constructor(
    private readonly _createRegionRepository: ICreateRegionRepository,
    private readonly _regionMapper: IMapper<Region, RegionDTO>
  ) {}
  async execute(data: RegionDTO) {
    if (!data.userId) throw new MissingItemError("The item userId is a must");

    const userModel = this._regionMapper.toEntity(data);

    const user = await this._createRegionRepository.execute(userModel);

    return this._regionMapper.toDTO(user);
  }
}
