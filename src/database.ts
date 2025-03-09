import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config();

const env = {
  MONGO_URI: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
};

const init = async function () {
  await mongoose.connect(env.MONGO_URI, {
    replicaSet: "rs0",
  });

  if (mongoose.connection.readyState === 1)
    logger.info(`MongoDB connection is ready`);
};

export default init();
