import mongoose from "mongoose";
import { RegionModel } from "../../models/region.model";
import { Region } from "../../../../../../domain/entity/region.entity";

export interface ICreateRegionRepository {
  execute(data: Region): Promise<Region>;
}

export class CreateRegionRepositoryMongoAdapter
  implements ICreateRegionRepository
{
  private _region = RegionModel;

  public async execute(data: Region): Promise<Region> {
    const session = await mongoose.startSession();
    session.startTransaction();

    const userId = data.userId;

    try {
      const [addedRegion] = await this._region.create(
        {
          name: data.name,
          user: data.userId,
          geometry: data.geometry,
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return new Region(
        addedRegion._id,
        addedRegion.name,
        userId,
        addedRegion.geometry
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
