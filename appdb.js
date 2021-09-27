const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT || 3000;
require("./helpers/mongooseClient");

/*

  Iteration # 9: Protecting Endpoints

  Implement a basic security mechanism to protect update and clearing operations.
  All DELETE, PUT, POST and PATCH operations will be protected by a Token that must be provided along with the request in order to
  perform the operation.
  The token will consist of the ID of the element to be modified, encoded in base64.

*/

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
