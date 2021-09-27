const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongoose connected...');
  })
  .catch((err) => {
    console.log(err);
  });
