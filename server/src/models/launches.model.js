const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort('-flightNumber');

  return !latestLaunch ? DEFAULT_FLIGHT_NUMBER : latestLaunch.flightNumber;
}

async function getAllLaunches(){
  return await launches.find({}, {
    '__id': 0, '__v': 0,
  });
}

async function saveLaunch(launch){
  try {
    const planet = await planets.findOne({
      keplerName: launch.target
    });

    if (!planet){
      throw new Error('No matching planet is found!')
    }

    await launches.findOneAndUpdate({
      flightNumber: launch.flightNumber // find by
    }, launch, {
      upsert: true,
    });
  } catch (err) {
    console.error(`Could not save launch! ${err}`);
  }
}

async function scheduleNewLaunch(launch){
  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['ZTM', 'Nasa'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunch(launchId){
  const aborted = await launches.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false
  });

  console.log('aborted', aborted);

  return aborted.modifiedCount === 1;
}

async function existsLaunchWithId(launchId){
  return await launches.findOne({
    flightNumber: launchId
  })
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunch,
  existsLaunchWithId
}