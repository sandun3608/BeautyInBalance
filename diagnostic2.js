const { MongoClient } = require('mongodb');

// The multi-node cluster connection string
const uri = "mongodb://Madhura:monGO%401stBeauty@ac-ltr1jms-shard-00-00.f0divln.mongodb.net:27017,ac-ltr1jms-shard-00-01.f0divln.mongodb.net:27017,ac-ltr1jms-shard-00-02.f0divln.mongodb.net:27017/beautyDB?tls=true&replicaSet=atlas-135fxe-shard-0&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Attempting node driver connection...");
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("DIAGNOSTIC 2 ERROR =>", err);
  } finally {
    await client.close();
  }
}
run();
