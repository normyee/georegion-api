import { Region } from "../../../../../../domain/entity/region.entity";
import { IGetAllRegionsRepository } from "../../../../../../domain/repositories/regions/get-all-regions.repositoy";
import { RegionModel } from "../../models/region.model";

export class GetAllRegionsRepositoryMongoAdapter
  implements IGetAllRegionsRepository
{
  private _region = RegionModel;

  public async execute(
    page: number = 1,
    limit: number = 10,
  ): Promise<Region[]> {
    const regions = await this._region
      .find()
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
