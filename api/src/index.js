import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js"; // Ensure this exports a Knex instance
import nestedRouter from "./routers/nested.js";
import mealRouter from "./routers/meal_get.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

apiRouter.get("/", async (req, res) => {
  try {
    const SHOW_TABLES_QUERY =
      process.env.DB_CLIENT === "mysql2"
        ? "SELECT * FROM Meal"
        : "SHOW TABLES;";
    
    const tables = await knex.raw(SHOW_TABLES_QUERY);

    res.json({ tables: tables.rows || tables });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

apiRouter.use("/meal", mealRouter);

// apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000; // Ensure a default port if not set
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});