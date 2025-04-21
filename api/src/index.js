import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js"; // Ensure this exports a Knex instance
import nestedRouter from "./routers/nested.js";
import mealsRouter from "./routers/meals.js";
import reservationRouter from "./routers/reservations.js";


const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

apiRouter.use("/meals", mealsRouter);

apiRouter.use("/reservations", reservationRouter);

app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000; // Ensure a default port if not set
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});