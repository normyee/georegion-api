import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config();

const env = {
  MONGO_URI: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`,
};

const init = async function () {
  await mongoose.connect(env.MONGO_URI);

  if (mongoose.connection.readyState === 1)
    logger.info(`MongoDB connection is ready`);
};

export default init();
