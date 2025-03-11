import mongoose from "mongoose";
import { RegionModel } from "../../models/region.model";
import { Region } from "../../../../../../domain/entity/region.entity";

export interface IUpdateRegionRepository {
  execute(id: string, data: Region): Promise<Region>;
}

export class UpdateRegionRepositoryMongoAdapter
  implements IUpdateRegionRepository
{
  private _region = RegionModel;

  public async execute(id: string, data: Region): Promise<Region> {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const updatedRegion = await this._region
        .findOneAndUpdate({ _id: id }, data, {
          new: true,
          session,
        })
        .exec();

      if (!updatedRegion) {
        throw new Error("Region not found");
      }

      await session.commitTransaction();
      session.endSession();

      return new Region(id, updatedRegion.name, updatedRegion.user.toString(), [
        updatedRegion.coordinates,
      ]);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}
