const mongoose = require('mongoose');

const planetsSchema = mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  }
});

// Connects launchesSchema with the "launches" collection
module.exports = mongoose.model('Planet', planetsSchema);