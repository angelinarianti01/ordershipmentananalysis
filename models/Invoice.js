const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  MerchantLocnID: {
    type: String,
  },
  MLID: {
    type: String,
  },
  TradeName: {
    type: String,
  },
  DateDespatched: {
    type: String,
  },
  DateCreated: {
    type: String,
  },
  ChargeCode: {
    type: String,
  },
  'Ldgmt Zone Code': {
    type: String,
  },
  'Destination Zone': {
    type: String,
  },
  'Manifest ID': {
    type: String,
  },
  'Lodgement Centre ID': {
    type: String,
  },
  'Consignment ID': {
    type: String,
  },
  'Consignment Article ID': {
    type: String,
  },
  'Total Consignment Count': {
    type: String,
  },
  'Total Article Count': {
    type: String,
  },
  'Actual Cubic Weight': {
    type: String,
  },
  'Chargeable Weight': {
    type: String,
  },
  'Amended Manifest Amount': {
    type: String,
  },
  'Consignee Name': {
    type: String,
  },
  'Reference 1': {
    type: String,
  },
  'Reference 2': {
    type: String,
  },
  'Email Notification': {
    type: String,
  },
  'Consignee Address Line 1': {
    type: String,
  },
  'Consignee Suburb': {
    type: String,
  },
  'Consignee Postcode': {
    type: String,
  },
  'Consignee State Code': {
    type: String,
  },
  'Consignee Country Code': {
    type: String,
  },
  'Consignment Phone Number': {
    type: String,
  },
  'Created By': {
    type: String,
  },
  'Return Name': {
    type: String,
  },
  'Return Address Line 1': {
    type: String,
  },
  'Return Postcode': {
    type: String,
  },
  'Return Suburb': {
    type: String,
  },
  'Return State Code': {
    type: String,
  },
  'Return Country Code': {
    type: String,
  },
  'Manifest Status': {
    type: String,
  },
  'Date Created Date': {
    type: String,
  },
  'Consignment Date of Actual Despatch Date': {
    type: String,
  },
  'Consignment Date Despatch Required Date': {
    type: String,
  },
});

module.exports = mongoose.model('invoice', InvoiceSchema);
