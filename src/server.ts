import  express  from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";

import v1Router from "./routes/v1/index.js";

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());

app.use("/v1", v1Router);

app.listen(process.env.API_PORT, () => {
  console.log(`APP listening on port ${process.env.API_PORT}`)
});
