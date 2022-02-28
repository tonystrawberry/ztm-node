const planets = require('./planets.mongo');

const { parse } = require('csv-parse');
const path = require('path');
const fs = require('fs');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

/*
const promise = new Promise((resolve, reject) => {
  resolve(42);
})

promise.then((result) => {

});

const result = await promise;
console.log(result);
*/

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    .pipe(parse({
      comment: '#',
      columns: true,
    }))
    .on('data', async (data) => {
      if (isHabitablePlanet(data)) {
        await savePlanet(data);
      }
    })
    .on('error', (err) => {
      console.log(err);
      reject(err);
    })
    .on('end', async () => {
      const countPlanetsFound = (await getAllPlanets()).length;
      console.log(`${countPlanetsFound} habitable planets found!`);
      resolve();
    });

  })
}

async function getAllPlanets() {
  return await planets.find({}, {
    '__id': 0, '__v': 0,
  });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name // find by
    }, {
      keplerName: planet.kepler_name // create if not found
    }, {
      upsert: true,
    });
  } catch (err) {
    console.error(`Could not save planet! ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};