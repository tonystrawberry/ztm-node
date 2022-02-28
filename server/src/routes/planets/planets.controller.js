const planetsModel = require('../../models/planets.model');

async function getAllPlanets(req, res) {
  const planets = await planetsModel.getAllPlanets();
  return res.status(200).json(planets);
}

module.exports = {
  getAllPlanets
};