import { Region } from "../../entity/region.entity";

export interface IGetAllRegionsRepository {
  execute(page: number, limit: number): Promise<Region[]>;
}
