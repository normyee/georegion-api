import { IGetRegionRepository } from "../../../domain/repositories/regions/get-region.repository";

export class GetRegionUseCase {
  constructor(private readonly _getRegionRepository: IGetRegionRepository) {}

  async execute(id: string) {
    return await this._getRegionRepository.execute(id);
  }
}
