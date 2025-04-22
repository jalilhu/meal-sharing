import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mealsRouter from "./routers/meals.js";
import reservationRouter from "./routers/reservations.js";
import contactsRouter from "./routers/contacts.js";
import reviewRouter from "./routers/review.js";


const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

apiRouter.use("/meals", mealsRouter);

apiRouter.use("/reservations", reservationRouter);

apiRouter.use("/contacts", contactsRouter);

apiRouter.use("/reviews", reviewRouter);

app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000; // Ensure a default port if not set
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});