import "dotenv/config";
import express from "express";
import knex from "../database_client.js";


const reservationRouter = express.Router()

reservationRouter.get("/", async (req, res) => {

    try{
        const reservations = await knex("Reservation").select("*");

        if(reservations.length === 0){
            res.status(404).json({message: "No reservation"})
            return
        }

        res.status(200).json(reservations);
    } catch (error) {
      console.error("Error fetching reservation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

reservationRouter.post("/", async (req, res) => {
    try{
        const [newReservationId] = await knex("Reservation").insert(req.body.reservation);
        res.status(201).json({
            message: "The new reservation has been added",
            reservationId: newReservationId
          });
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
})

reservationRouter.get("/:id", async (req, res) => {
    const reservationID = req.params.id
    try{
        const reservation = await knex("Reservation").select("*").where({ id: reservationID });

        if(reservation.length === 0){
            res.status(404).json({message: "No reservation"})
            return
        }

        res.status(200).json(reservation);
    } catch (error) {
      console.error("Error fetching reservation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

reservationRouter.put("/:id", async (req, res) => {
  const reservationId = req.params.id
  const updateReservation = req.body.reservation;
  const allowedFields = ['number_of_guests', 'meal_id', 'created_date','contact_phonenumber', 'contact_name', 'contact_email'];
  const validUpdateData = Object.keys(updateReservation)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updateReservation[key];
      return obj;
    }, {});
  if (Object.keys(validUpdateData).length === 0) {
    return res.status(400).json({ message: 'No valid fields provided for update' });
  }

  try {
    await knex('Reservation')
      .where({ id: reservationId })
      .update(validUpdateData)

    res.status(202).json({ message: 'reservation updated successfully' })
  }
  catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


reservationRouter.delete("/:id", async (req, res) => {
  const reservationId = req.params.id
  try {
    const reservation = await knex("Reservation").where({ id: reservationId });
    if (reservation.length === 0) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      await knex("Reservation").where({ id: reservationId }).del();
      res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


reservationRouter.get("/future-reservations", async (req, res) => {
  try {
    const FUTURE_reservations_QUERY = "SELECT * FROM Reservation WHERE Reservation.When > NOW()";
    const result = await knex.raw(FUTURE_reservations_QUERY);
    const reservations = Array.isArray(result) ? result[0] : result.rows || result
    res.json({ reservations });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

reservationRouter.get("/past-reservations", async (req, res) => {
  try {
    const PAST_reservations_QUERY = "SELECT * FROM Reservation WHERE Reservation.When < NOW()";
    const result = await knex.raw(PAST_reservations_QUERY);
    const reservations = Array.isArray(result) ? result[0] : result.rows || result
    res.json({ reservations });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


reservationRouter.get("/first-reservation", async (req, res) => {
  try {
    const FIRST_reservation_QUERY = "SELECT * FROM Reservation WHERE id = (SELECT MIN(id) FROM Reservation)";
    const result = await knex.raw(FIRST_reservation_QUERY);
    const reservation = result[0]?.[0] || result.rows?.[0] || null;
    if (!reservation) {
      res.status(404).json({ message: "there no reservations available at the moment." })
    }
    res.json(reservation);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

reservationRouter.get("/last-reservation", async (req, res) => {
  try {
    const LAST_reservation_QUERY = "SELECT * FROM Reservation WHERE id = (SELECT MAX(id) FROM Reservation)";
    const result = await knex.raw(LAST_reservation_QUERY);
    const reservation = result[0]?.[0];
    if (!reservation) {
      res.status(404).json({ message: "there no reservations available at the moment." })
    }
    res.status(200).json({ message: reservation });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default reservationRouter;