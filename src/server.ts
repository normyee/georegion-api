import * as app from "express";
import { UserModel } from "./models";
import * as dotenv from "dotenv";
import { validateCheckZodVariables } from "./env.validation";
import { logger } from "./logger";
import "./index";

dotenv.config();

const config = {
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_DB: process.env.MONGO_DB,
};
validateCheckZodVariables(config);

const server = app();
const router = app.Router();

const STATUS = {
  OK: 200,
  CREATED: 201,
  UPDATED: 201,
  NOT_FOUND: 400,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  DEFAULT_ERROR: 418,
};

router.get("/user", async (req, res) => {
  const { page, limit } = req.query;

  const [users, total] = await Promise.all([
    UserModel.find().lean(),
    UserModel.count(),
  ]);

  return res.json({
    rows: users,
    page,
    limit,
    total,
  });
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Region not found" });
  }

  return user;
});

router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { update } = req.body;

  const user = (await UserModel.findOne({ _id: id }).lean()) as any;

  if (!user) {
    res.status(STATUS.DEFAULT_ERROR).json({ message: "Region not found" });
  }

  user.name = update.name;

  await user.save();

  return res.sendStatus(201);
});

server.use(router);

export default server.listen(3003, () => {
  logger.info("Server is running on port 3003");
});
