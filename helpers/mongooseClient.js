const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // FIX: quit this line from the module author

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
