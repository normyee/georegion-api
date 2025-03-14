import {
  NetworkAxiosAdapter,
} from "../../../../shared/network.provider";
import { GeoAddress, GeoCoordinates, GeoResponse, INetwork, LoggerInstance } from "../../../../shared/types";
import { IGeoLib } from "../../../abstractions/geo-lib.interface";
import { Logger } from "../logger";

const logger = new Logger().getLogger();

export class GeoLibOpenStreetMapAdapter implements IGeoLib {
  constructor(
    private readonly _network: INetwork,
    private readonly _logger: LoggerInstance,
  ) {}

  public async getAddressFromCoordinates(
    coordinates: GeoCoordinates,
  ): Promise<GeoAddress> {
    try {
      const lat = Array.isArray(coordinates) ? coordinates[1] : coordinates.lat;
      const lon = Array.isArray(coordinates) ? coordinates[0] : coordinates.lng;

      const result = await this._network.get<GeoResponse>("/reverse", {
        params: {
          lon: lon,
          lat: lat,
          format: "geojson",
        },
      });

      const geoAddress =
        result.features[0].properties.display_name ||
        result.features[0].properties.name;

      return geoAddress;
    } catch (error) {
      this._logger.error("Error getting address from coordinates", error);
    }
  }

  public async getCoordinatesFromAddress(
    address: GeoAddress,
  ): Promise<GeoCoordinates> {
    try {
      const result = await this._network.get<GeoResponse>("/search", {
        params: {
          q: address,
          format: "geojson",
        },
      });

      const coordinates = {
        lng: result.features[0].geometry.coordinates[0],
        lat: result.features[0].geometry.coordinates[1],
      };

      return coordinates;
    } catch (error) {
      this._logger.error("Error getting coordinates from address", error);
    }
  }
}

const OPEN_STREET_MAP_API_URL = "https://nominatim.openstreetmap.org";

export default new GeoLibOpenStreetMapAdapter(
  new NetworkAxiosAdapter(OPEN_STREET_MAP_API_URL),
  logger,
);
