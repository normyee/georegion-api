import { IGetAllRegionsRepository } from "../../../domain/repositories/regions/get-all-regions.repositoy";

export class GetAllRegionsUseCase {
  constructor(
    private readonly _getAllRegionsRepository: IGetAllRegionsRepository,
  ) {}

  async execute(page: number, limit: number) {
    return await this._getAllRegionsRepository.execute(page, limit);
  }
}
