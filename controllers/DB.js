const { Client } = require('pg')
require('dotenv').config()

/* const pool = new Client({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    port : process.env.DB_PORT
}) */

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})


pool.connect()

module.exports = pool;