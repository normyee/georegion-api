import { Region } from "../../../../../../domain/entity/region.entity";
import { RegionModel } from "../../models/region.model";

export interface IGetAllRegionsRepository {
  execute(page: number, limit: number): Promise<Region[]>;
}

export class GetAllRegionsRepositoryMongoAdapter
  implements IGetAllRegionsRepository
{
  private _region = RegionModel;

  public async execute(
    page: number = 1,
    limit: number = 10
  ): Promise<Region[]> {
    const regions = await this._region
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return regions.map(
      (region) =>
        new Region(region._id, region.name, region.user.toString(), [
          region.coordinates,
        ])
    );
  }
}
