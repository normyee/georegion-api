import { Region } from "../../../../../../domain/entity/region.entity";
import { RegionModel } from "../../models/region.model";

export interface IGeospatialProximityRepository {
  execute(
    geoPoint: number[],
    distanceInKilometers: number,
    page: number,
    limit: number
  ): Promise<Region[]>;
}

export class GeospatialProximityRepositoryMongoAdapter
  implements IGeospatialProximityRepository
{
  private _region = RegionModel;
  async execute(
    geoPoint: number[],
    distanceInKilometers: number,
    page: number,
    limit: number
  ): Promise<Region[]> {
    const distanceInMeters = distanceInKilometers * 1000;

    const regions = await this._region
      .find({
        geometry: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: geoPoint,
            },
            $maxDistance: distanceInMeters,
          },
        },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return regions.map(
      (region) =>
        new Region(
          region._id,
          region.name,
          region.user.toString(),
          region.geometry
        )
    );
  }
}
