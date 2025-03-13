import pino from "pino";
import { getFormattedDate } from "../../../../shared/get-formatted-date";


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

export const logger = pino(
  {
    level: "trace",
  },
  pino.multistream([{ stream: consoleTransport }, { stream: fileTransport }])
);
