import { IPointContainedInRegionRepository } from "../../../infra/database/orm/mongoose/repositories/regions/point-contained-in-region.repository";

export class PointContainedInRegionUseCase {
  constructor(
    private readonly _pointContainedInRegionRepository: IPointContainedInRegionRepository
  ) {}

  async execute(point: number[], page: number, limit: number) {
    return await this._pointContainedInRegionRepository.execute(point, page, limit);
  }
}
