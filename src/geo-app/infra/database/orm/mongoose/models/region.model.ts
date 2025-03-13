import "reflect-metadata";
import * as mongoose from "mongoose";
import {
  Prop,
  Ref,
  modelOptions,
  getModelForClass,
} from "@typegoose/typegoose";
import { User } from "./user.model";
import { Base } from "./common/base.model";

@modelOptions({
  schemaOptions: { validateBeforeSave: false, versionKey: false },
})
export class Region extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ ref: "User", required: true, type: () => String })
  user: Ref<User>;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Mixed,
  })
  geometry!: {
    type: string;
    coordinates: number[][][];
  };
}

export const RegionModel = getModelForClass(Region);

RegionModel.collection.createIndex({ geometry: "2dsphere" });
