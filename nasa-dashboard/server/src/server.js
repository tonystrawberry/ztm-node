const http = require('http');

require('dotenv').config();

const { mongoConnect } = require('./services/mongo');
const app = require('./app');

const planetsModel = require('./models/planets.model');
const launchesModel = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


async function startServer(){
  await mongoConnect();
  await planetsModel.loadPlanetsData();
  await launchesModel.loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();