const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();

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
    await client.db(process.env.DB_NAME).command({ ping: 1 });
    console.log(`Connected successfully to db ${process.env.DB_NAME}`);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

module.exports = { client };
