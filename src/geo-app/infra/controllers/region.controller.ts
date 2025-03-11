import { Body, Controller, Delete, Get, Param, Patch, Post, QueryParam } from "routing-controllers";
import { RegionDTO } from "../../application/common/dtos/region.dto";
import { CreateRegionUseCase } from "../../application/use-case/region/create-region.use-case";
import { DeleteRegionUseCase } from "../../application/use-case/region/delete-region.use-case";
import { GetAllRegionsUseCase } from "../../application/use-case/region/get-all-regions.use-case";
import { GetRegionUseCase } from "../../application/use-case/region/get-region.use-case";
import { UpdateRegionUseCase } from "../../application/use-case/region/update-region.use-case";

@Controller("/regions")
export class RegionController {
  constructor(
    private _createRegionUseCase: CreateRegionUseCase,
    private _deleteRegionUseCase: DeleteRegionUseCase,
    private _getRegionUseCase: GetRegionUseCase,
    private _getAllRegionsUseCase: GetAllRegionsUseCase,
    private _updateRegionUseCase: UpdateRegionUseCase
  ) {}

  @Post("/")
  async create(@Body() data: RegionDTO) {
    return await this._createRegionUseCase.execute(data);
  }

  @Get("/:id")
  async getById(@Param("id") id: string) {
    return await this._getRegionUseCase.execute(id);
  }

  @Get("/")
  async getAll(
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number
  ) {
    return await this._getAllRegionsUseCase.execute(page, limit);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    return await this._deleteRegionUseCase.execute(id);
  }

  @Patch("/:id")
  async update(@Param("id") id: string, @Body() data: RegionDTO) {
    return await this._updateRegionUseCase.execute(id, data);
  }
}