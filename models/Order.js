const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  OrderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  ClientId: {
    type: Number,
    required: true,
  },
  ShippingGross: {
    type: Number,
    default: -1,
  },
  DespatchDate: {
    type: String,
  },
});

module.exports = mongoose.model('order', OrderSchema);
