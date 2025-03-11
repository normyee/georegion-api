import { IGetAllRegionsRepository } from "../../../infra/database/orm/mongoose/repositories/regions/get-all-regions.repository";

export class GetAllRegionsUseCase {
  constructor(
    private readonly _getAllRegionsRepository: IGetAllRegionsRepository
  ) {}

  async execute(page: number, limit: number) {
    return await this._getAllRegionsRepository.execute(page, limit);
  }
}
