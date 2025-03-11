import mongoose from "mongoose";
import { logger } from "../../../providers/logger/logger";

type MongoConnectionConfig = {
  host: string;
  port: string;
  name: string;
};

export class MongoBoostrap {
  private _logger: any;

  private static instance: MongoBoostrap;

  private constructor() {
    this._logger = logger;
  }

  public static getInstance(): MongoBoostrap {
    if (!this.instance) {
      this.instance = new MongoBoostrap();
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
