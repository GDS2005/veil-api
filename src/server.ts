import "dotenv/config";

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import v1Router from "./routes/v1/index.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use("/v1", v1Router);

const PORT = process.env.API_PORT || 3000
app.listen(PORT, () => {
  console.log(`APP listening on port ${PORT}`);
});