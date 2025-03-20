import { Region } from "../../entity/region.entity";

export interface IPointContainedInRegionRepository {
  execute(geoPoint: number[], page: number, limit: number): Promise<Region[]>;
}
