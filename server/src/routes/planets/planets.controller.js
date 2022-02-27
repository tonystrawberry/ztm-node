const planetsModel = require('../../models/planets.model');

function getAllPlanets(req, res) {
  return res.status(200).json(planetsModel.getAllPlanets());
}

module.exports = {
  getAllPlanets
};