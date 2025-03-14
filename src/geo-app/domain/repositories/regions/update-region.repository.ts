import { Region } from "../../entity/region.entity";

export interface IUpdateRegionRepository {
  execute(id: string, data: Region): Promise<Region>;
}
