const { MongoClient } = require('mongodb');

// The standard +srv connection string with correct password encoding
const uri = "mongodb+srv://Madhura:monGO%401stBeauty@cluster0.f0divln.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Attempting direct MongoDB driver connection...");
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("DIAGNOSTIC ERROR =>", err);
  } finally {
    await client.close();
  }
}
run();
