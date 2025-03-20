import { RegionDTO } from "../../common/dtos/region.dto";
import { Region } from "../../../domain/entity/region.entity";
import { IMapper } from "../../../domain/common/mapper.interface";
import { IUpdateRegionRepository } from "../../../domain/repositories/regions/update-region.repository";

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
