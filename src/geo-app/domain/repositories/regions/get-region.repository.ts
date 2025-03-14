import { Region } from "../../entity/region.entity";

export interface IGetRegionRepository {
  execute(id: string): Promise<Region>;
}
