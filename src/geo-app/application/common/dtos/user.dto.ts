import { GeoCoordinates } from "../../infra/providers/geo/geo-lib.provider";

export type UserDTO = {
  id?: string;
  name: string;
  email: string;
  address?: string;
  coordinates?: GeoCoordinates;
};
