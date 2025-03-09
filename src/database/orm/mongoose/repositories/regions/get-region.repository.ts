import { RegionModel } from "../../models/region.model";

export class GetRegionRepositoryMongoAdapter {
  private _region = RegionModel;

  public async execute(data: any): Promise<any> {
    const foundRegion = await this._region.findOne({ _id: data.id }).exec();

    if (!foundRegion) {
      throw new Error("Region not found");
    }

    return foundRegion;
  }
}
