import knex from "knex";

console.log("DB Connection Details:", {
  client: process.env.DB_CLIENT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE_NAME,
  ssl: process.env.DB_USE_SSL,
});

const connection = knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // Ensure port is a number
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    ssl: { rejectUnauthorized: false },
  },
});

export default connection;