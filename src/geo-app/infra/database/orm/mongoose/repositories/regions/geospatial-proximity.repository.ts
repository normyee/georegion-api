import { FilterQuery } from "mongoose";
import { Region } from "../../../../../../domain/entity/region.entity";
import { RegionModel } from "../../models/region.model";
import { IGeospatialProximityRepository } from "../../../../../../domain/repositories/regions/geospatial-proximity.repository";

export class GeospatialProximityRepositoryMongoAdapter
  implements IGeospatialProximityRepository
{
  private _region = RegionModel;

  async execute(
    geoPoint: number[],
    distanceInKilometers: number,
    userId: string | null,
    page: number,
    limit: number,
  ): Promise<Region[]> {
    const distanceInMeters = distanceInKilometers * 1000;

    const query: FilterQuery<typeof this._region> = {
      geometry: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: geoPoint,
          },
          $maxDistance: distanceInMeters,
        },
      },
    };

    if (userId) {
      query.user = userId; // Apenas inclui o filtro se `userId` não for null
    }

    const regions = await this._region
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return regions.map(
      (region) =>
        new Region(
          region._id,
          region.name,
          region.user.toString(),
          region.geometry,
        ),
    );
  }
}
