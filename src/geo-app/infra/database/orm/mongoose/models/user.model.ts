import "reflect-metadata";
import {
  getModelForClass,
  modelOptions,
  Prop,
  Ref,
} from "@typegoose/typegoose";
import { Base } from "./common/base.model";
import { Region } from "./region.model";

@modelOptions({
  schemaOptions: { validateBeforeSave: false, versionKey: false },
})
export class User extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: () => [Number] })
  coordinates: [number, number];

  @Prop({ required: true, default: [], ref: "Region", type: () => String })
  regions: Ref<Region>[];
}

export const UserModel = getModelForClass(User);
