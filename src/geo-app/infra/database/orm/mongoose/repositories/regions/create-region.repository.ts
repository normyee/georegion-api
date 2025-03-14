import mongoose from "mongoose";
import { RegionModel } from "../../models/region.model";
import { UserModel } from "../../models/user.model";
import { ICreateRegionRepository } from "../../../../../../domain/repositories/regions/create-region.repository";
import { Region } from "../../../../../../domain/entity/region.entity";

export class CreateRegionRepositoryMongoAdapter
  implements ICreateRegionRepository
{
  private _region = RegionModel;
  private _user = UserModel;

  public async execute(data: Region): Promise<Region> {
    const session = await mongoose.startSession();
    session.startTransaction();

    const userId = data.userId;

    try {
      const [addedRegion] = await this._region.create(
        [
          {
            name: data.name,
            user: data.userId,
            geometry: data.geometry,
          },
        ],
        { session },
      );

      if (userId) {
        await this._user.updateOne(
          { _id: userId },
          { $push: { regions: addedRegion._id } },
          { session },
        );
      }

      await session.commitTransaction();
      session.endSession();

      return new Region(
        addedRegion._id,
        addedRegion.name,
        userId,
        addedRegion.geometry,
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
