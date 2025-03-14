import { Region } from "../../entity/region.entity";

export interface IGeospatialProximityRepository {
  execute(
    geoPoint: number[],
    distanceInKilometers: number,
    userId: string | null,
    page: number,
    limit: number,
  ): Promise<Region[]>;
}
