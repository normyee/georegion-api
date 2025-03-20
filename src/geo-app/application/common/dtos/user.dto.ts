import { GeoCoordinates } from "../../../../shared/types";

export type UserDTO = {
  id?: string;
  name: string;
  email: string;
  address?: string;
  coordinates?: GeoCoordinates;
};
