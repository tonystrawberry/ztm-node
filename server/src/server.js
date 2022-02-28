const http = require('http');
const { mongoConnect } = require('./services/mongo');
const app = require('./app');

const planetsModel = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


async function startServer(){
  await mongoConnect();
  await planetsModel.loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();