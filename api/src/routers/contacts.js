import express from 'express'
import knex from "../database_client.js";

const contactsRouter = express.Router();

contactsRouter.get('/', async (req, res) => {
    try {
        let query = knex("Contacts").select("*");

        if ("sort" in req.query) {
            const sortParam = req.query.sort.toString().trim();
            const [column, direction = "asc"] = sortParam.split(/\s+/);

            const allowedColumns = ["first_name", "last_name", "email"];
            const allowedDirections = ["asc", "desc"];

            if (allowedColumns.includes(column) && allowedDirections.includes(direction.toLowerCase())) {
                query = query.orderBy(column, direction);
            } else {
                return res.status(400).json({ message: "Invalid sort parameter" });
            }
        }
        const data = await query;
        if (data.length === 0) {
            res.status(404).json({ message: "No contacts found" })
            return;
        }
        console.log("SQL", query.toSQL().sql);
        res.status(200).json(data);


    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


export default contactsRouter;