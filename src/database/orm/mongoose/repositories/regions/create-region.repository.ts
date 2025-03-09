import mongoose from "mongoose";
import { RegionModel } from "../../models/region.model";
// import { Region } from "../../../../../entity/region.entity";

export class CreateRegionRepositoryMongoAdapter {
  private _region = RegionModel;

  public async execute(data: any): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [addedRegion] = await this._region.create(
        [
          {
            name: data.name,
            email: data.email,
            address: data.address,
            coordinates: data.coordinates,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return addedRegion;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
