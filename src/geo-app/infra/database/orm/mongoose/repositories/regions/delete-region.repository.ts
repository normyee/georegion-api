import mongoose from "mongoose";
import { RegionModel } from "../../models/region.model";
import { Region } from "../../../../../../domain/entity/region.entity";

export interface IDeleteRegionRepository {
  execute(id: string): Promise<Region>;
}

export class DeleteRegionRepositoryMongoAdapter
  implements IDeleteRegionRepository
{
  private _region = RegionModel;
  public async execute(id: string): Promise<Region> {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const deletedRegion = await this._region
        .findOneAndDelete({ _id: id })
        .session(session);

      if (!deletedRegion) {
        throw new Error("Region was not found");
      }

      await session.commitTransaction();
      session.endSession();

      return new Region(deletedRegion._id, deletedRegion.name, id, [
        deletedRegion.coordinates,
      ]);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}
