const launchesModel = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function getAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);

  const launches = await launchesModel.getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

function addNewLaunch(req, res) {
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
    return res.status(400).json({
      error: "Missing required properties."
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)){
    return res.status(400).json({
      error: 'Invalid launch date.'
    })
  }

  launchesModel.scheduleNewLaunch(launch);
  return res.status(201).json(launch); // Created
}

async function abortLaunch(req, res){
  const launchId = Number(req.params.id);
  if (!launchId){
    return res.status(400).json({
      error: 'Missing ID'
    });
  }

  const existsLaunch = await launchesModel.existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: 'Launch not found',
    })
  }

  const aborted = await launchesModel.abortLaunch(launchId);
  if (!aborted){
    return res.status(400).json({
      error: 'Launch not aborted'
    })
  }
  return res.status(200).json({
    ok: true
  });
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch
};