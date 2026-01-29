import  Express  from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";

dotenv.config();

const app = Express();

app.use(morgan('dev'))
app.use(helmet())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.API_PORT, () => {
  console.log(`APP listening on port ${process.env.API_PORT}`)
})

