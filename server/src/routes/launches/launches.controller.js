const launchesModel = require('../../models/launches.model');

function getAllLaunches(req, res) {
  return res.status(200).json(launchesModel.getAllLaunches());
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

  launchesModel.addNewLaunch(launch);
  return res.status(201).json(launch); // Created
}

function abortLaunch(req, res){
  const launchId = Number(req.params.id);
  if (!launchId){
    return res.status(400).json({
      error: 'Missing ID.'
    });
  }

  if (!launchesModel.existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: 'Launch not found',
    })
  }

  const aborted = launchesModel.abortLaunch(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch
};