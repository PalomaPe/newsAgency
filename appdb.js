/*

  Iteration # 7: Database Persistence

  Persist the processed data in a database. Upgrade your web server implementation to read and write data to a database. No more syncing
  with files or in memory.
  
*/

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT || 3000;
require("./helpers/mongooseClient");

const app = express();
const articles = require("./Routers/articlesdb");

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

app.use("/articles", articles);

app.listen(port, () => {
  console.log("info", `Server up and listening on PORT: ${port}`);
});
