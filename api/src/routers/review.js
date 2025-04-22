import express from 'express'
import knex from "../database_client.js";


const reviewRouter = express.Router();


reviewRouter.get("/", async (req, res) => {

    try {
        const getAllReviews = await knex('Review').select("*");
        if (getAllReviews === 0) {
            res.status(201).json({ message: "No reviews found" })
            return;
        }
        res.status(200).json(getAllReviews)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


reviewRouter.post("/", async (req, res) => {
    try {
        const { title, description, meal_id, stars } = req.body
        const today = new Date()
        const [newReviewId] = await knex("Review").insert({ title: title, description: description, meal_id: meal_id, stars: stars, created_date: today });
        res.status(201).json({
            message: "The new review has been added",
            review_id: newReviewId
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


reviewRouter.put("/:id", async (req, res) => {
    try {
        const { title, description, stars } = req.body
        const review_id = req.params.id
        const existing = await knex("Review").select("id").where("id", review_id).first();
        if (!existing) {
            console.log("Review does not exist");
            return res.status(404).send("Review does not exist");
          }
          await knex("Review")
          .where("id", review_id)
          .update({
            title,
            description,
            stars
          });
          res.status(200).send("Review updated successfully");


    } catch (error) {
        res.status(500).json({ message: `${error.message} - update failed` });
    }
})

reviewRouter.get("/:id", async (req, res) => {
    try {
        const review_id = req.params.id
        const existing = await knex("Review").select("*").where("id", review_id).first();
        if (!existing) {
            console.log("Review does not exist");
            return res.status(404).send("Review does not exist");
          }
          res.status(200).json(existing);
    } catch (error) {
        res.status(500).json({ message: `${error.message}` });
    }
})

reviewRouter.delete("/:id", async (req, res) => {
    try {
        const review_id = req.params.id
        const existing = await knex("Review").select("*").where("id", review_id).first().del();
        if (!existing) {
            console.log("Review does not exist");
            return res.status(404).send("Review does not exist");
          }
        res.status(200).json(existing);
    } catch (error) {
        res.status(500).json({ message: `${error.message}` });
    }
})



export default reviewRouter;