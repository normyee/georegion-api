import { Region } from "../../../../../../domain/entity/region.entity";
import { RegionModel } from "../../models/region.model";

export interface IGetRegionRepository {
  execute(id: string): Promise<Region>;
}

export class GetRegionRepositoryMongoAdapter implements IGetRegionRepository {
  private _region = RegionModel;

  public async execute(id: string): Promise<Region> {
    const foundRegion = await this._region.findOne({ _id: id }).exec();

    if (!foundRegion) {
      return null;
    }

    return new Region(
      id,
      foundRegion.name,
      foundRegion.user.toString(),
      foundRegion.geometry
    );
  }
}
