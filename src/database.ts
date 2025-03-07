import mongoose from "mongoose";
import { logger } from "./logger";

const env = {
  MONGO_URI:
    "mongodb://root:example@127.0.0.1:27021/oz-tech-test?authSource=admin",
};

const init = async function () {
  await mongoose.connect(env.MONGO_URI);

  if (mongoose.connection.readyState === 1)
    logger.info(`MongoDB connection is ready`);
};

export default init();
