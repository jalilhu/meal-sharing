import "dotenv/config";
import express from "express";
import knex from "../database_client.js";


const mealsRouter = express.Router()

mealsRouter.get("/", async (req, res) => {

  try{
    const meals = await knex("Meal").select("*");

    if(meals.length === 0){
        res.status(404).json({message: "No meals found"})
        return
    }

    res.status(200).json(meals);
    
} catch (error) {
  console.error("Error fetching meals:", error);
  res.status(500).json({ error: "Internal Server Error" });
}
});

mealsRouter.post("/", async (req, res) => {
  try{
    const [newMealId] = await knex("Reservation").insert(req.body.meal);
    res.status(201).json({
        message: "The new meal has been added",
        mealId: newMealId
      });
} catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

mealsRouter.get("/:id", async (req, res) => {
  const mealID = req.params.id
  try {
    const meal_with_id = await knex("Meal").select("*").where({ id: mealID });

    if (meal_with_id.length === 0) {
      res.status(404).json({ "message": `can't find any meal with the id: ${req.params.id}` });
      return
    }
    res.status(200).json(meal_with_id[0])
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

mealsRouter.put("/:id", async (req, res) => {
  const mealId = req.params.id
  const updateMeal = req.body.meal;
  const allowedFields = ['title', 'description', 'location', 'when', 'max_reservations', 'price'];
  const validUpdateData = Object.keys(updateMeal)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updateMeal[key];
      return obj;
    }, {});
  if (Object.keys(validUpdateData).length === 0) {
    return res.status(400).json({ message: 'No valid fields provided for update' });
  }

  try {
    await knex('Meal')
      .where({ id: mealId })
      .update(validUpdateData)

    res.status(202).json({ message: 'Meal updated successfully' })
  }
  catch (error) {
    console.error('Error updating Meal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/// DELETE based on the Given ID
mealsRouter.delete("/:id", async (req, res) => {
  const mealId = req.params.id
  try {
    const meal = await knex('Meal').where({id : mealId})
    if(meal.length === 0){
      res.status(404).json({message: "meal was not found!"})
      return
    }
    await knex('Meal').where({id : mealId}).del()
    res.status(200).json({ message: 'Meal deleted successfully' })
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


mealsRouter.get("/future-meals", async (req, res) => {
  try {
    const FUTURE_MEALS_QUERY = "SELECT * FROM Meal WHERE Meal.When > NOW()";
    const result = await knex.raw(FUTURE_MEALS_QUERY);
    const meals = Array.isArray(result) ? result[0] : result.rows || result
    res.json({ meals });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

mealsRouter.get("/past-meals", async (req, res) => {
  try {
    const PAST_MEALS_QUERY = "SELECT * FROM Meal WHERE Meal.When < NOW()";
    const result = await knex.raw(PAST_MEALS_QUERY);
    const meals = Array.isArray(result) ? result[0] : result.rows || result
    res.json({ meals });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


mealsRouter.get("/first-meal", async (req, res) => {
  try {
    const FIRST_MEAL_QUERY = "SELECT * FROM Meal WHERE id = (SELECT MIN(id) FROM Meal)";
    const result = await knex.raw(FIRST_MEAL_QUERY);
    const meal = result[0]?.[0] || result.rows?.[0] || null;
    if (!meal) {
      res.status(404).json({ message: "there no meals available at the moment." })
    }
    res.json(meal);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

mealsRouter.get("/last-meal", async (req, res) => {
  try {
    const LAST_MEAL_QUERY = "SELECT * FROM Meal WHERE id = (SELECT MAX(id) FROM Meal)";
    const result = await knex.raw(LAST_MEAL_QUERY);
    const meal = result[0]?.[0];
    if (!meal) {
      res.status(404).json({ message: "there no meals available at the moment." })
    }
    res.status(200).json({ message: meal });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default mealsRouter;