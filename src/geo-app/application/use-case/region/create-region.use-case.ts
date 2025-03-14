import { IMapper } from "../../../domain/common/mapper.interface";
import { Region } from "../../../domain/entity/region.entity";
import { ICreateRegionRepository } from "../../../domain/repositories/regions/create-region.repository";
import { RegionDTO } from "../../common/dtos/region.dto";
import { MissingItemError } from "../../common/errors";


export class CreateRegionUseCase {
  constructor(
    private readonly _createRegionRepository: ICreateRegionRepository,
    private readonly _regionMapper: IMapper<Region, RegionDTO>,
  ) {}
  async execute(data: RegionDTO) {
    if (!data.userId) throw new MissingItemError("The item userId is a must");

    const userModel = this._regionMapper.toEntity(data);

    const user = await this._createRegionRepository.execute(userModel);

    return this._regionMapper.toDTO(user);
  }
}
