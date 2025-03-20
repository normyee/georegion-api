import mongoose from "mongoose";
import { RegionModel } from "../../models/region.model";
import { Region } from "../../../../../../domain/entity/region.entity";
import { UserModel } from "../../models/user.model";
import { IDeleteRegionRepository } from "../../../../../../domain/repositories/regions/delete-region.repository";

export class DeleteRegionRepositoryMongoAdapter
  implements IDeleteRegionRepository
{
  private _region = RegionModel;
  private _user = UserModel;

  public async execute(id: string): Promise<Region> {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const deletedRegion = await this._region
        .findOneAndDelete({ _id: id })
        .session(session);

      if (!deletedRegion) {
        await session.abortTransaction();
        session.endSession();
        return null;
      }

      await this._user
        .updateOne({ _id: deletedRegion.user }, { $pull: { regions: id } })
        .session(session);

      await session.commitTransaction();
      session.endSession();

      return new Region(
        deletedRegion._id,
        deletedRegion.name,
        id,
        deletedRegion.geometry,
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}
