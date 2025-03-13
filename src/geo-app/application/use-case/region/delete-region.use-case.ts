import { IDeleteRegionRepository } from "../../../infra/database/orm/mongoose/repositories/regions/delete-region.repository";

export class DeleteRegionUseCase {
  constructor(
    private readonly _deleteRegionRepository: IDeleteRegionRepository
  ) {}

  async execute(id: string) {
    return await this._deleteRegionRepository.execute(id);
  }
}
