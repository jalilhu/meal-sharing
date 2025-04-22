import "dotenv/config";
import express from "express";
import knex from "../database_client.js";


const mealsRouter = express.Router()


mealsRouter.get("/", async (req, res) => {
  try {
    const allowedFields = ["when", "max_reservations", "price"]
    const allowedDirection = ["asc", "desc"]
    const { sortKey, sortDir } = req.query;

    if (!sortKey || !allowedFields.includes(sortKey)) {
      return res.status(400).send("Please provide a valid sortKey.");
    }
    const direction = sortDir && allowedDirection.includes(sortDir) ? sortDir : "asc";
    const mealsSorted = await knex("Meal").select("*").orderBy(sortKey, direction);
    res.status(200).json(mealsSorted);

  } catch (error) {
    console.error("Error getting meals sorted:", error);Ï
    res.status(500).json({ error: "Internal Server Error" });
  }
})


mealsRouter.get("/", async (req, res) => {
  const { maxPrice, title, availableReservations, dateAfter, dateBefore, limit } = req.query;

  try {
    let queryBuilder = knex("Meal").select("*");

    if (maxPrice) {
      queryBuilder = queryBuilder.where("price", "<=", parseFloat(maxPrice));
    }

    if (availableReservations === "true") {
      queryBuilder = queryBuilder.where("max_reservations", ">", 0);
    }

    if (title) {
      queryBuilder = queryBuilder.where("title", "like", `%${title}%`);
    }

    if (dateAfter) {
      queryBuilder = queryBuilder.where("created_date", ">=", dateAfter);
    }

    if (dateBefore) {
      queryBuilder = queryBuilder.where("created_date", "<=", dateBefore);
    }

    if (limit) {
      queryBuilder = queryBuilder.limit(parseInt(limit));
    }

    const results = await queryBuilder;
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mealsRouter.get("/", async (req, res) => {

  try {
    const meals = await knex("Meal").select("*");

    if (meals.length === 0) {
      res.status(404).json({ message: "No meals found" })
      return
    }

    res.status(200).json(meals);

  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

mealsRouter.post("/", async (req, res) => {
  try {
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

mealsRouter.get("/:meal_id/reviews", async (req, res) => {
  const mealId = req.params.meal_id
  console.log(mealId)
  try {
    const mealReviews = await knex('Review').select("*").where("meal_id", "=", mealId);
    if (mealReviews === 0) {
      res.status(201).json({ message: "No reviews found" })
      return;
    }
    res.status(200).json(mealReviews)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

mealsRouter.get("/future-meals", async (req, res) => {
  try {
    const todaysDate = new Date()
    const queryBuilder = await knex('Meal').select("*").where("When", ">", todaysDate);
    res.status(200).json(queryBuilder)
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

mealsRouter.get("/past-meals", async (req, res) => {
  try {
    const todaysDate = new Date()
    const queryBuilder = await knex('Meal').select("*").where("When", "<", todaysDate);
    res.status(200).json(queryBuilder)
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

mealsRouter.get("/first-meal", async (req, res) => {
  try {
    const queryBuilder = await knex('Meal').select("*").min("id").groupBy("id");
    res.status(200).json(queryBuilder[0])
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

mealsRouter.get("/last-meal", async (req, res) => {
  const LAST_MEAL_QUERY = "SELECT * FROM Meal WHERE id = (SELECT MAX(id) FROM Meal)";
  try {
    const queryBuilder = await knex('Meal').select("*").max("id").groupBy("id");
    res.status(200).json(queryBuilder[queryBuilder.length - 1])
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

mealsRouter.delete("/:id", async (req, res) => {
  const mealId = req.params.id
  try {
    const meal = await knex('Meal').where({ id: mealId })
    if (meal.length === 0) {
      res.status(404).json({ message: "meal was not found!" })
      return
    }
    await knex('Meal').where({ id: mealId }).del()
    res.status(200).json({ message: 'Meal deleted successfully' })
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default mealsRouter;