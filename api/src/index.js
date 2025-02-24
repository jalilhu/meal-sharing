import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js"; // Ensure this exports a Knex instance
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

apiRouter.get("/future-meals", async (req, res) => {
  try {
    const SHOW_TABLES_QUERY =
      process.env.DB_CLIENT === "mysql2"
        ? "SELECT * FROM Meal WHERE Meal.When > NOW()"
        : "SHOW TABLES;";
    const result = await knex.raw(SHOW_TABLES_QUERY);
    const meals = Array.isArray(result) ? result[0] : result.rows || result
    res.json({ meals });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

apiRouter.get("/past-meals", async(req, res)=>{
  const SHOW_TABLES_QUERY = 
  process.env.DB_CLIENT === "mysql2"
  ? "SELECT * FROM Meal WHERE Meal.When < NOW()"
  : "SHOW TABLES;";
  const result = await knex.raw(SHOW_TABLES_QUERY);
  const meals = Array.isArray(result) ? result[0] : result.rows || result
  res.json({ meals });
})

apiRouter.get("/all-meals", async (req, res) => {
  try {
    const SHOW_TABLES_QUERY =
      process.env.DB_CLIENT === "mysql2"
        ? "SELECT * FROM Meal ORDER BY Meal.id"
        : "SHOW TABLES;";
    
        const result = await knex.raw(SHOW_TABLES_QUERY);
        const meals = Array.isArray(result) ? result[0] : result.rows || result
        res.json({ meals });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

apiRouter.get("/first-meal", async (req, res) => {
  try {
    const SHOW_TABLES_QUERY =
      process.env.DB_CLIENT === "mysql2"
        ? "SELECT * FROM Meal WHERE id = (SELECT MIN(id) FROM Meal)"
        : "SHOW TABLES;";
    
        const result = await knex.raw(SHOW_TABLES_QUERY);
        const meal = result[0]?.[0] || result.rows?.[0] || null;
        if(!meal){
          res.status(404).json({ message: "there no meals available at the moment."})
        }
        res.json({ meal });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
apiRouter.get("/last-meal", async (req, res) => {
  try {
    const SHOW_TABLES_QUERY =
      process.env.DB_CLIENT === "mysql2"
        ? "SELECT * FROM Meal WHERE id = (SELECT MAX(id) FROM Meal)"
        : "SHOW TABLES;";
    
        const result = await knex.raw(SHOW_TABLES_QUERY);
        const meal = result[0]?.[0] || result.rows?.[0] || null;
        if(!meal){
          res.status(404).json({ message: "there no meals available at the moment."})
        }

        res.status(200).json( {message: meal });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

apiRouter.use("/nested", nestedRouter);
app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000; // Ensure a default port if not set
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});