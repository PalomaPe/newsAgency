/*

  Iteración #8: CRUD Articles
  
  Complete all the editing and reading operations on the articles.
  Until now, the authors have been managed by indicating the name of the author when creating the article.
  In this activity, authors will have their own collection, and they must be created beforehand in order to create author articles. 
  Since each article refers to its author ID, data consistency must be ensured when applying a delete operation.

*/

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT || 3000;
require("./helpers/mongooseClient");

const app = express();
const authors = require("./Routers/authorsdb");
const articles = require("./Routers/articlesdb");

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

app.use("/articles", articles);
app.use("/authors", authors);

app.listen(port, () => {
  console.log("info", `Server up and listening on PORT: ${port}`);
});
