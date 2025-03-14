import { Region } from "../../entity/region.entity";

export interface ICreateRegionRepository {
  execute(data: Region): Promise<Region>;
}
