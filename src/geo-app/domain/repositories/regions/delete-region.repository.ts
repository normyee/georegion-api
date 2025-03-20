import { Region } from "../../entity/region.entity";

export interface IDeleteRegionRepository {
  execute(id: string): Promise<Region>;
}
