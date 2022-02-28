const mongoose = require('mongoose');

const MONGO_URL = "mongodb://nasa-api:UDLEw8lJoAZrfloL@nasacluster-shard-00-00.wmhyj.mongodb.net:27017,nasacluster-shard-00-01.wmhyj.mongodb.net:27017,nasacluster-shard-00-02.wmhyj.mongodb.net:27017/nasa?ssl=true&replicaSet=atlas-1jgawc-shard-0&authSource=admin&retryWrites=true&w=majority"

mongoose.connection.on('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect(){
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}