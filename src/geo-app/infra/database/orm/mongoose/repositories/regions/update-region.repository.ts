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
        .findOneAndUpdate(
          { _id: id },
          { name: data.name, geometry: data.geometry },
          {
            new: true,
            session,
          }
        )
        .exec();

      if (!updatedRegion) {
        await session.abortTransaction();
        session.endSession();
        return null;
      }

      await session.commitTransaction();
      session.endSession();

      return new Region(
        id,
        updatedRegion.name,
        updatedRegion.user.toString(),
        updatedRegion.geometry
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}
