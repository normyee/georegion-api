import * as app from "express";
import * as dotenv from "dotenv";
import { validateCheckZodVariables } from "./shared/env.validation";
import { MongoBoostrap } from "./geo-app/infra/database/orm/mongoose";
import { GeoAppModule } from "./geo-app/infra/geo-app.module";
import { Logger } from "./geo-app/infra/providers/logger";

const logger = new Logger().getLogger();

dotenv.config();

const config = {
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_DB: process.env.MONGO_DB,
  SECRET: process.env.SECRET,
};
validateCheckZodVariables(config);

const mongo = MongoBoostrap.getInstance();
const server = app();
const router = app.Router();
server.use(app.json());

const geoAppModule = new GeoAppModule(server);
geoAppModule.configureServices();
geoAppModule.configureServer();

server.use(router);

server.listen(3003, async () => {
  logger.info("Server is running on port 3003");

  await mongo.startManagerConnection({
    host: config.MONGO_HOST,
    port: config.MONGO_PORT,
    name: config.MONGO_DB,
  });
});
