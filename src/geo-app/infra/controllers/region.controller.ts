import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  QueryParam,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { RegionDTO } from "../../application/common/dtos/region.dto";
import { CreateRegionUseCase } from "../../application/use-case/region/create-region.use-case";
import { DeleteRegionUseCase } from "../../application/use-case/region/delete-region.use-case";
import { GetAllRegionsUseCase } from "../../application/use-case/region/get-all-regions.use-case";
import { GetRegionUseCase } from "../../application/use-case/region/get-region.use-case";
import { UpdateRegionUseCase } from "../../application/use-case/region/update-region.use-case";
import { PointContainedInRegionUseCase } from "../../application/use-case/region/point-contained-in-region.use-case";
import { GeospatialProximityUseCase } from "../../application/use-case/region/geospatial-proximity.use-case";
import { AuthMiddleware } from "../middlewares/auth-validation.middleware";
import { MissingItemError } from "../../application/common/errors";
import { Response } from "express";
import { LoggerInstance, TenantRequest } from "../../../shared/types";

@Controller("/regions")
@UseBefore(AuthMiddleware)
export class RegionController {
  constructor(
    private _createRegionUseCase: CreateRegionUseCase,
    private _deleteRegionUseCase: DeleteRegionUseCase,
    private _getRegionUseCase: GetRegionUseCase,
    private _getAllRegionsUseCase: GetAllRegionsUseCase,
    private _updateRegionUseCase: UpdateRegionUseCase,
    private _pointContainedInRegionUseCase: PointContainedInRegionUseCase,
    private _geospatialProximityUseCase: GeospatialProximityUseCase,
    private _logger: LoggerInstance,
  ) {}

  @Post("/")
  async create(
    @Res() res: Response,
    @Body() data: RegionDTO,
    @Req() req: TenantRequest,
  ) {
    try {
      data.userId = req.tenant.id;
      const regionData = await this._createRegionUseCase.execute(data);

      return {
        status: "success",
        message: "Region has been created successfully",
        data: regionData,
      };
    } catch (error) {
      if (error instanceof MissingItemError) {
        return res
          .status(400)
          .json({ status: "failure", message: error.message });
      }
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Get("/containing")
  async pointContainedInRegion(
    @Res() res: Response,
    @QueryParam("lng") lng: number,
    @QueryParam("lat") lat: number,
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
  ) {
    try {
      const regionData = await this._pointContainedInRegionUseCase.execute(
        [lng, lat],
        page,
        limit,
      );

      return {
        status: "success",
        message: `Regions containing the point [${lng}, ${lat}] have been found successfully.`,
        data: regionData,
      };
    } catch (error) {
      this._logger.error("An unexpected error occurred", error);

      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Get("/near")
  async GeospatialProximity(
    @Res() res: Response,
    @QueryParam("lng") lng: number,
    @QueryParam("lat") lat: number,
    @QueryParam("km_distance") distanceInKilometers: number,
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
    @QueryParam("filter_user") filterUser: string,
    @Req() req: TenantRequest,
  ) {
    try {
      let userId = null;

      if (filterUser === "true") {
        userId = req.tenant.id;
      }

      const regionData = await this._geospatialProximityUseCase.execute(
        [lng, lat],
        distanceInKilometers,
        userId,
        page,
        limit,
      );

      return {
        status: "success",
        message: `Regions within ${distanceInKilometers} km have been found successfully.`,
        data: regionData,
      };
    } catch (error) {
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Get("/:id")
  async getById(@Res() res: Response, @Param("id") id: string) {
    try {
      const regionData = await this._getRegionUseCase.execute(id);

      if (!regionData) {
        return res.status(404).json({
          status: "failure",
          message: "Region not found",
        });
      }

      return {
        status: "success",
        message: "Region has been fetched successfully",
        data: regionData,
      };
    } catch (error) {
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Get("/")
  async getAll(
    @Res() res: Response,
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
  ) {
    try {
      const regionData = await this._getAllRegionsUseCase.execute(page, limit);

      return {
        status: "success",
        message: `Regions have been found successfully`,
        data: regionData,
      };
    } catch (error) {
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Delete("/:id")
  async delete(@Res() res: Response, @Param("id") id: string) {
    try {
      const regionData = await this._deleteRegionUseCase.execute(id);

      if (!regionData) {
        return res.status(404).json({
          status: "failure",
          message: "Region not found",
        });
      }

      return {
        status: "success",
        message: "Region has been deleted successfully",
        data: regionData,
      };
    } catch (error) {
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }

  @Patch("/:id")
  async update(
    @Res() res: Response,
    @Param("id") id: string,
    @Body() data: RegionDTO,
  ) {
    try {
      const regionData = await this._updateRegionUseCase.execute(id, data);

      if (!regionData) {
        return res.status(404).json({
          status: "failure",
          message: "Region not found",
        });
      }

      return {
        status: "success",
        message: "Region has been updated successfully",
        data: regionData,
      };
    } catch (error) {
      this._logger.error("An unexpected error occurred", error);
      return res
        .status(500)
        .json({ status: "failure", message: "An unexpected error occurred" });
    }
  }
}
