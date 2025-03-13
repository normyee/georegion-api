import { Region } from "../../../../../../domain/entity/region.entity";
import { RegionModel } from "../../models/region.model";

export interface IPointContainedInRegionRepository {
  execute(geoPoint: number[], page: number, limit: number): Promise<Region[]>;
}

export class PointContainedInRegionRepositoryMongoAdapter
  implements IPointContainedInRegionRepository
{
  private _region = RegionModel;
  async execute(
    geoPoint: number[],
    page: number,
    limit: number
  ): Promise<Region[]> {
    const regions = await this._region
      .find({
        geometry: {
          $geoIntersects: {
            $geometry: {
              type: "Point",
              coordinates: geoPoint,
            },
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
