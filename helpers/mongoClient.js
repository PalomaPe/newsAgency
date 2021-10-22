const { MongoClient } = require("mongodb");

MongoClient.Promise = global.Promise;
/**
 * REVIEW:
 *  Lo recomendado es hacer esta llamada en el script principal,
 *  en el que se ejcuta como primero.
 *  Por ejemplo, el server.js o el app.js
 *
 *  Ya para cuando se llame a este mongoClient.js
 *  las variables de environment deberían de estar disponibles.
 */
const dotenv = require("dotenv").config();
const express = require("express");

const app = express();
console.log(dotenv.parsed);

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    const db = await client.db(process.env.DB_NAME).command({ ping: 1 });
    app.locals.db = db; // FIX: make db available globally in the app
    console.log(`Connected successfully to db ${process.env.DB_NAME}`);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

module.exports = { client };
