declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_USERNAME: string;
    MONGO_HOST: string;
    MONGO_PASSWORD: string;
    MONGO_PORT: string;
    MONGO_DB: string;
  }
}
