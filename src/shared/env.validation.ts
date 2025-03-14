import { z, ZodError } from "zod";
import { logger } from "../geo-app/infra/providers/logger/logger";

enum EnvErrors {
  required = "Env variable required",
}

const zodEnvVariables = z.object({
  MONGO_USERNAME: z.string({ required_error: EnvErrors.required }),
  MONGO_HOST: z.string({ required_error: EnvErrors.required }),
  MONGO_PASSWORD: z.string({ required_error: EnvErrors.required }),
  MONGO_PORT: z.string({ required_error: EnvErrors.required }),
  MONGO_DB: z.string({ required_error: EnvErrors.required }),
  SECRET: z.string({ required_error: EnvErrors.required }),
});

type EnvVariables = Record<string, string | number | boolean>;
export type ValidatedEnvVariables = z.output<typeof zodEnvVariables>;

export const validateCheckZodVariables = (
  config: EnvVariables
): ValidatedEnvVariables => {
  try {
    const envs = zodEnvVariables.parse(config);

    logger.trace("Process Env variables validated successfully!");

    return envs;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(
        (e) => `Env variable ${e.path[0]} error - ${e.message}`
      );

      logger.error(`Validation check failed:\n${formattedErrors.join("\n")}`);

      throw new Error(
        `Validation check failed:\n${formattedErrors.join("\n")}`
      );
    } else {
      logger.error("Error occurred on env variables validation check");
      throw error;
    }
  }
};
