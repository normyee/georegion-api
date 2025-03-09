import { User } from "../../../../../entity/user.entity";
import mongoose from "mongoose";
import { RegionModel } from "../../models/region.model";

export class UpdateRegionRepositoryMongoAdapter {
  private _region = RegionModel;

  public async execute(data: any): Promise<any> {
    const session = await mongoose.startSession();
    let updatedRegion = null;

    session.startTransaction();

    try {
      updatedRegion = await this._region
        .findOneAndUpdate({ _id: data.id }, data, {
          new: true,
          session,
        })
        .exec();

      if (!updatedRegion) {
        throw new Error("Region not found");
      }

      await session.commitTransaction();
      session.endSession();

      return updatedRegion;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}
