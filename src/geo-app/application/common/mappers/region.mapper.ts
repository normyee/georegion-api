import { Region } from "../../../domain/entity/region.entity";
import { RegionDTO } from "../dtos/region.dto";
import { IMapper } from "./user.mapper";

export class RegionMapper implements IMapper<Region, RegionDTO> {
  toDTO(region: Region): RegionDTO {
    return {
      id: region.id || null,
      name: region.name,
      userId: region.userId,
      geometry: region.geometry,
    };
  }

  toEntity(data: RegionDTO, id?: string): Region {
    return new Region(id || null, data.name, data.userId, data.geometry);
  }
}
