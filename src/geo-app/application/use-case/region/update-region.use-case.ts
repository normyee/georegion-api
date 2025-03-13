import { IMapper } from "../../common/mappers/user.mapper";
import { RegionDTO } from "../../common/dtos/region.dto";
import { IUpdateRegionRepository } from "../../../infra/database/orm/mongoose/repositories/regions/update-region.repository";
import { Region } from "../../../domain/entity/region.entity";

export class UpdateRegionUseCase {
  constructor(
    private readonly _updateRegionRepository: IUpdateRegionRepository,
    private readonly _regionMapper: IMapper<Region, RegionDTO>
  ) {}

  async execute(id: string, data: RegionDTO): Promise<RegionDTO> {
    const region = this._regionMapper.toEntity(data);

    const updatedUser = await this._updateRegionRepository.execute(id, region);

    return this._regionMapper.toDTO(updatedUser);
  }
}
