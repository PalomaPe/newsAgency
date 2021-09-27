/*

  Iteration #6: Processing POST

  Add the POST / articles endpoint, where you will receive the data for a new article. The data must be validated using the same validation
  rules already implemented.
  After validation, write to the file db.json or invalid.json as appropriate. In case the validation is successful, the article will be
  available in memory and accessible through the GET / articles / <id> endpoint.
  
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
