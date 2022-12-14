const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  OrderNumber: {
    type: String,
    required: true,
  },
  EstimatedCost: {
    type: Number,
    required: true,
  },
  ActualCost: {
    type: Number,
    required: true,
  },
  Alerted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('alert', AlertSchema);
