import * as app from "express";
import * as dotenv from "dotenv";
import { validateCheckZodVariables } from "./shared/env.validation";
import { MongoBoostrap } from "./geo-app/infra/database/orm/mongoose";
import { logger } from "./geo-app/infra/providers/logger/logger";
import { CreateUserUseCase } from "./geo-app/application/use-case/user/create-user.use-case";
import { CreateUserRepositoryMongoAdapter } from "./geo-app/infra/database/orm/mongoose/repositories/users/create-user.repository";
import { GeoLibOpenStreetMapAdapter } from "./geo-app/infra/providers/geo/geo-lib.provider";
import { NetworkAxiosAdapter } from "./shared/network.provider";
import { useContainer, useExpressServer } from "routing-controllers";
import Container from "typedi";
import { DeleteUserUseCase } from "./geo-app/application/use-case/user/delete-user-use-case";
import { DeleteUserRepositoryMongoAdapter } from "./geo-app/infra/database/orm/mongoose/repositories/users/delete-user.repository";
import { GetUserUseCase } from "./geo-app/application/use-case/user/get-user.use-case";
import { GetUserRepositoryMongoAdapter } from "./geo-app/infra/database/orm/mongoose/repositories/users/get-user.repository";
import { GetAllUsersUseCase } from "./geo-app/application/use-case/user/get-all-users.use-case";
import { GetAllUsersRepositoryMongoAdapter } from "./geo-app/infra/database/orm/mongoose/repositories/users/get-all-users.repository";
import { UpdateUserUseCase } from "./geo-app/application/use-case/user/update-user.use-case";
import { UpdateUserRepositoryMongoAdapter } from "./geo-app/infra/database/orm/mongoose/repositories/users/update-user.repository";
import { UserMapper } from "./geo-app/application/common/mappers/user.mapper";
import { UserController } from "./geo-app/infra/controllers/user.controller";
import { RegionController } from "./geo-app/infra/controllers/region.controller";
import { CreateRegionUseCase } from "./geo-app/application/use-case/region/create-region.use-case";
import { RegionMapper } from "./geo-app/application/common/mappers/region.mapper";
import { CreateRegionRepositoryMongoAdapter } from "./geo-app/infra/database/orm/mongoose/repositories/regions/create-region.repository";
import { DeleteRegionUseCase } from "./geo-app/application/use-case/region/delete-region.use-case";
import { DeleteRegionRepositoryMongoAdapter } from "./geo-app/infra/database/orm/mongoose/repositories/regions/delete-region.repository";
import { GetRegionUseCase } from "./geo-app/application/use-case/region/get-region.use-case";
import { GetRegionRepositoryMongoAdapter } from "./geo-app/infra/database/orm/mongoose/repositories/regions/get-region.repository";
import { GetAllRegionsUseCase } from "./geo-app/application/use-case/region/get-all-regions.use-case";
import { GetAllRegionsRepositoryMongoAdapter } from "./geo-app/infra/database/orm/mongoose/repositories/regions/get-all-regions.repository";
import { UpdateRegionUseCase } from "./geo-app/application/use-case/region/update-region.use-case";
import { UpdateRegionRepositoryMongoAdapter } from "./geo-app/infra/database/orm/mongoose/repositories/regions/update-region.repository";

dotenv.config();

const config = {
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_DB: process.env.MONGO_DB,
};
validateCheckZodVariables(config);

const mongo = MongoBoostrap.getInstance();

const createUserUsecase = new CreateUserUseCase(
  new CreateUserRepositoryMongoAdapter(),
  new GeoLibOpenStreetMapAdapter(
    new NetworkAxiosAdapter("https://nominatim.openstreetmap.org"),
    logger
  ),
  new UserMapper()
);

const deleteUserUsecase = new DeleteUserUseCase(
  new DeleteUserRepositoryMongoAdapter()
);

const getUserUsecase = new GetUserUseCase(new GetUserRepositoryMongoAdapter());

const getAllUsersUsecase = new GetAllUsersUseCase(
  new GetAllUsersRepositoryMongoAdapter()
);

const updateUserUsecase = new UpdateUserUseCase(
  new UpdateUserRepositoryMongoAdapter(),
  new UserMapper(),
  new GeoLibOpenStreetMapAdapter(
    new NetworkAxiosAdapter("https://nominatim.openstreetmap.org"),
    logger
  )
);

Container.set(
  UserController,
  new UserController(
    createUserUsecase,
    deleteUserUsecase,
    getUserUsecase,
    getAllUsersUsecase,
    updateUserUsecase
  )
);

const createRegionUsecase = new CreateRegionUseCase(
  new CreateRegionRepositoryMongoAdapter(),
  new RegionMapper()
);

const deleteRegionUsecase = new DeleteRegionUseCase(
  new DeleteRegionRepositoryMongoAdapter()
);

const getRegionUsecase = new GetRegionUseCase(
  new GetRegionRepositoryMongoAdapter()
);

const getAllRegionsUsecase = new GetAllRegionsUseCase(
  new GetAllRegionsRepositoryMongoAdapter()
);

const updateRegionUsecase = new UpdateRegionUseCase(
  new UpdateRegionRepositoryMongoAdapter(),
  new RegionMapper()
);

Container.set(
  RegionController,
  new RegionController(
    createRegionUsecase,
    deleteRegionUsecase,
    getRegionUsecase,
    getAllRegionsUsecase,
    updateRegionUsecase
  )
);

useContainer(Container);

const server = app();
const router = app.Router();

server.use(app.json());

useExpressServer(server, {
  controllers: [UserController],
});

server.use(router);

server.listen(3003, async () => {
  logger.info("Server is running on port 3003");

  await mongo.startManagerConnection({
    host: config.MONGO_HOST,
    port: config.MONGO_PORT,
    name: config.MONGO_DB,
  });
});
