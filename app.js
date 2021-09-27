/*

  Iteration #5: Web server with ExpressJS

  Refactor the implementation of iteration #4, using the NodeJS Express framework.
  
*/

const express = require("express");
const app = express();
const port = 8000;
const articles = require("./Routers/articles");

app.set("port", 8000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

app.use("/articles", articles);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
