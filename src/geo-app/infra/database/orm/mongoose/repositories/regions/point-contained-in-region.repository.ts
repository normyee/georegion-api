import { Region } from "../../../../../../domain/entity/region.entity";
import { IPointContainedInRegionRepository } from "../../../../../../domain/repositories/regions/point-contained-in-region.repository";
import { RegionModel } from "../../models/region.model";

export class PointContainedInRegionRepositoryMongoAdapter
  implements IPointContainedInRegionRepository
{
  private _region = RegionModel;
  async execute(
    geoPoint: number[],
    page: number,
    limit: number,
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
          region.geometry,
        ),
    );
  }
}
