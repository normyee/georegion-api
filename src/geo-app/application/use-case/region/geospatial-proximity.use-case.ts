import { IGeospatialProximityRepository } from "../../../domain/repositories/regions/geospatial-proximity.repository";

export class GeospatialProximityUseCase {
  constructor(
    private readonly _geospatialProximityRepository: IGeospatialProximityRepository,
  ) {}

  async execute(
    geoPoint: number[],
    distanceInKilometers: number,
    userId: string,
    page: number,
    limit: number,
  ) {
    return await this._geospatialProximityRepository.execute(
      geoPoint,
      distanceInKilometers,
      userId,
      page,
      limit,
    );
  }
}
