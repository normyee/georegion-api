import { useContainer, useExpressServer } from "routing-controllers";
import Container from "typedi";
import { CreateUserUseCase } from "../application/use-case/user/create-user.use-case";
import { CreateUserRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/users/create-user.repository";
import { GeoLibOpenStreetMapAdapter } from "./providers/geo";
import { NetworkAxiosAdapter } from "../../shared/network.provider";
import { UserMapper } from "../application/common/mappers/user.mapper";
import { AuthProvider } from "../../shared/auth.provider";
import { DeleteUserUseCase } from "../application/use-case/user/delete-user-use-case";
import { DeleteUserRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/users/delete-user.repository";
import { GetUserUseCase } from "../application/use-case/user/get-user.use-case";
import { GetUserRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/users/get-user.repository";
import { GetAllUsersUseCase } from "../application/use-case/user/get-all-users.use-case";
import { GetAllUsersRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/users/get-all-users.repository";
import { UpdateUserUseCase } from "../application/use-case/user/update-user.use-case";
import { UpdateUserRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/users/update-user.repository";
import { UserController } from "./controllers/user.controller";
import { CreateRegionUseCase } from "../application/use-case/region/create-region.use-case";
import { CreateRegionRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/regions/create-region.repository";
import { RegionMapper } from "../application/common/mappers/region.mapper";
import { DeleteRegionUseCase } from "../application/use-case/region/delete-region.use-case";
import { DeleteRegionRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/regions/delete-region.repository";
import { GetRegionUseCase } from "../application/use-case/region/get-region.use-case";
import { GetRegionRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/regions/get-region.repository";
import { GetAllRegionsUseCase } from "../application/use-case/region/get-all-regions.use-case";
import { GetAllRegionsRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/regions/get-all-regions.repository";
import { UpdateRegionUseCase } from "../application/use-case/region/update-region.use-case";
import { UpdateRegionRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/regions/update-region.repository";
import { GeospatialProximityUseCase } from "../application/use-case/region/geospatial-proximity.use-case";
import { PointContainedInRegionUseCase } from "../application/use-case/region/point-contained-in-region.use-case";
import { PointContainedInRegionRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/regions/point-contained-in-region.repository";
import { GeospatialProximityRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/regions/geospatial-proximity.repository";
import { RegionController } from "./controllers/region.controller";
import { AuthMiddleware } from "./middlewares/auth-validation.middleware";

import { Express } from "express";
import { Logger } from "./providers/logger";
import { LoginUserUseCase } from "../application/use-case/user/login-user.use-case";
import { GetUserByEmailRepositoryMongoAdapter } from "./database/orm/mongoose/repositories/users/get-user-by-email.repository";

const logger = new Logger().getLogger();

export class GeoAppModule {
  private container = Container;
  private _server: Express;

  constructor(server: Express) {
    this._server = server;
  }

  public configureServices() {
    const createUserUsecase = new CreateUserUseCase(
      new CreateUserRepositoryMongoAdapter(),
      new GeoLibOpenStreetMapAdapter(
        new NetworkAxiosAdapter("https://nominatim.openstreetmap.org"),
        logger,
      ),
      new UserMapper(),
      new AuthProvider(logger),
    );

    const deleteUserUsecase = new DeleteUserUseCase(
      new DeleteUserRepositoryMongoAdapter(),
    );

    const getUserUsecase = new GetUserUseCase(
      new GetUserRepositoryMongoAdapter(),
    );

    const getAllUsersUsecase = new GetAllUsersUseCase(
      new GetAllUsersRepositoryMongoAdapter(),
    );

    const updateUserUsecase = new UpdateUserUseCase(
      new UpdateUserRepositoryMongoAdapter(),
      new UserMapper(),
      new GeoLibOpenStreetMapAdapter(
        new NetworkAxiosAdapter("https://nominatim.openstreetmap.org"),
        logger,
      ),
    );

    const loginUserUsecase = new LoginUserUseCase(
      new GetUserByEmailRepositoryMongoAdapter(),
      new AuthProvider(logger),
    );

    this.container.set(
      UserController,
      new UserController(
        createUserUsecase,
        deleteUserUsecase,
        getUserUsecase,
        getAllUsersUsecase,
        updateUserUsecase,
        logger,
        loginUserUsecase,
      ),
    );

    const createRegionUsecase = new CreateRegionUseCase(
      new CreateRegionRepositoryMongoAdapter(),
      new RegionMapper(),
    );

    const deleteRegionUsecase = new DeleteRegionUseCase(
      new DeleteRegionRepositoryMongoAdapter(),
    );

    const getRegionUsecase = new GetRegionUseCase(
      new GetRegionRepositoryMongoAdapter(),
    );

    const getAllRegionsUsecase = new GetAllRegionsUseCase(
      new GetAllRegionsRepositoryMongoAdapter(),
    );

    const updateRegionUsecase = new UpdateRegionUseCase(
      new UpdateRegionRepositoryMongoAdapter(),
      new RegionMapper(),
    );

    const pointContainedInRegionUsecase = new PointContainedInRegionUseCase(
      new PointContainedInRegionRepositoryMongoAdapter(),
    );

    const geospatialProximityUsecase = new GeospatialProximityUseCase(
      new GeospatialProximityRepositoryMongoAdapter(),
    );

    this.container.set(
      RegionController,
      new RegionController(
        createRegionUsecase,
        deleteRegionUsecase,
        getRegionUsecase,
        getAllRegionsUsecase,
        updateRegionUsecase,
        pointContainedInRegionUsecase,
        geospatialProximityUsecase,
        logger,
      ),
    );

    this.container.set(
      AuthMiddleware,
      new AuthMiddleware(new AuthProvider(logger)),
    );

    useContainer(this.container);
  }

  public configureServer() {
    useExpressServer(this._server, {
      controllers: [UserController, RegionController],
    });
  }

  public getContainer(): Container {
    return this.container;
  }
}
