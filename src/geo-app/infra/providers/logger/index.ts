import pino, { Logger as PinoLogger } from "pino";
import { getFormattedDate } from "../../../../shared/get-formatted-date";
import { ILogger } from "../../../../shared/types";

export class Logger implements ILogger {
  logger: PinoLogger;

  constructor() {
    this.logger = this.createLogger();
  }

  createLogger(): PinoLogger {
    const consoleTransport = pino.transport({
      target: "pino-pretty",
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: getFormattedDate(),
      },
    });

    const fileTransport = pino.transport({
      target: "pino/file",
      options: {
        destination: "./logs/app.log",
        mkdir: true,
      },
    });

    return pino(
      { level: "trace" },
      pino.multistream([
        { stream: consoleTransport },
        { stream: fileTransport },
      ]),
    );
  }

  getLogger(): PinoLogger {
    return this.logger;
  }
}
