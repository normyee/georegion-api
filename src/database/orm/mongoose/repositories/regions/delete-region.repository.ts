import mongoose from "mongoose";
import { RegionModel } from "../../models/region.model";

export class RegionUserRepositoryMongoAdapter {
  private _region = RegionModel;
  public async execute(data: any): Promise<any> {
    const session = await mongoose.startSession();
    let deletedRegion = null;

    session.startTransaction();

    try {
      deletedRegion = await this._region
        .findOneAndDelete({ _id: data.id })
        .session(session);

      if (!deletedRegion) {
        throw new Error("Region was not found");
      }

      await session.commitTransaction();
      session.endSession();

      return deletedRegion;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}
