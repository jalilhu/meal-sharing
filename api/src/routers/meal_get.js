import "dotenv/config";
import express from "express";
import knex from "../database_client.js";


const mealRouter = express.Router()


mealRouter.get("/future-meals", async (req, res) => {
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
  
  mealRouter.get("/past-meals", async(req, res)=>{
    const SHOW_TABLES_QUERY = 
    process.env.DB_CLIENT === "mysql2"
    ? "SELECT * FROM Meal WHERE Meal.When < NOW()"
    : "SHOW TABLES;";
    const result = await knex.raw(SHOW_TABLES_QUERY);
    const meals = Array.isArray(result) ? result[0] : result.rows || result
    res.json({ meals });
  })
  
  mealRouter.get("/all-meals", async (req, res) => {
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
  
  mealRouter.get("/first-meal", async (req, res) => {
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

  mealRouter.get("/last-meal", async (req, res) => {
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
  

  export default mealRouter;