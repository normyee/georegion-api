import mongoose from "mongoose";
import { Logger } from "../../../providers/logger";
import {
  LoggerInstance,
  MongoConnectionConfig,
} from "../../../../../shared/types";

export class MongoBoostrap {
  private _logger: LoggerInstance;

  private static instance: MongoBoostrap;

  private constructor(logger: LoggerInstance) {
    this._logger = logger;
  }

  public static getInstance(
    logger: LoggerInstance = new Logger().getLogger(),
  ): MongoBoostrap {
    if (!this.instance) {
      this.instance = new MongoBoostrap(logger);
    }
    return this.instance;
  }

  public async startManagerConnection({
    host,
    port,
    name,
  }: MongoConnectionConfig): Promise<void> {
    const mongoUri = `mongodb://${host}:${port}/${name}`;

    try {
      await mongoose.connect(mongoUri, {
        replicaSet: "rs0",
      });

      if (mongoose.connection.readyState === 1) {
        this._logger.info(`MongoDB connection is ready: ${mongoUri}`);
      }
    } catch (error) {
      this._logger.error("Failed to connect to MongoDB", error);
    }
  }
}
