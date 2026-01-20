import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });   // load env here too



console.log("DB CONNECT CONFIG:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  database: process.env.DB_NAME
});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

export default db;
console.log("DB CONFIG:", process.env.DB_NAME);
port: Number(process.env.DB_PORT || 3306)
