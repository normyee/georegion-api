import "reflect-metadata";
import { getModelForClass, pre, Prop, Ref } from "@typegoose/typegoose";
import { Base } from "./common/base.model";
import lib from "../../../../providers/geo/geo-lib.provider";
import { Region } from "./region.model";

@pre<User>("save", async function (next) {
  const user = this as Omit<any, keyof User> & User;

  if (user.isModified("coordinates")) {
    user.address = await lib.getAddressFromCoordinates(user.coordinates);
  } else if (user.isModified("address")) {
    const coordinates = await lib.getCoordinatesFromAddress(user.address);
    const lat = Array.isArray(coordinates) ? coordinates[1] : coordinates.lat;
    const lng = Array.isArray(coordinates) ? coordinates[0] : coordinates.lng;

    user.coordinates = [lng, lat];
  }

  next();
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
