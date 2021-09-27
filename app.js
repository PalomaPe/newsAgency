const express = require('express');

const app = express();
const port = 8000;
const articles = require('./Routers/articles');

app.set('port', 8000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

app.use('/articles', articles);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
