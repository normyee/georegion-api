import { GeoAddress, GeoCoordinates } from "../../shared/types";

export interface IGeoLib {
  getAddressFromCoordinates(coordinates: GeoCoordinates): Promise<GeoAddress>;

  getCoordinatesFromAddress(address: GeoAddress): Promise<GeoCoordinates>;
}
