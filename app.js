const express = require('express');
const axios = require('axios');
const connectDB = require('./config/db');
const fetchApiKey = require('./config/api');
const Invoice = require('./models/Invoice');
const Order = require('./models/Order');
const Alert = require('./models/Alert');
// Uncomment below on local host
// require('dotenv').config();

const app = express();

// Database
connectDB();

// Middleware: Body parser
app.use(express.json());

// Webhook Catch
app.post('/order/despatched', async (req, res) => {
  try {
    // Destructuring request
    let { OrderNumber, ClientId, DespatchDate } = req;

    // Create order if it has not been created
    let order = await Order.findOne({
      OrderNumber: OrderNumber,
    });

    if (!order) {
      order = new Order({
        OrderNumber: OrderNumber,
        ClientId: ClientId,
        // Default Shipping Gross
        DespatchDate: DespatchDate,
      });
      await order.save();
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(401).send('Invalid token sent');
  }
});

// On Invoice Change
Invoice.watch().on('change', async (data) => {
  // Checks whether the 'change' is 'insert' because all insert data has 'fullDocument' field whereas 'update' and 'remove' does not
  if (data.fullDocument) {
    // Destructure csv field
    const orderNumber = data.fullDocument['Reference 1'];
    const invoice = data.fullDocument;
    const invoicedCost = data.fullDocument['Actual Amt'];

    // Validate 'Actual Amt' field from the csv
    if (!invoicedCost) {
      console.log('cannot find invoiced cost');
    } else {
      // Retrieve estimated cost from 'orders' collection
      let estimatedCost;
      const order = await Order.findOne({
        OrderNumber: orderNumber,
      });

      // Validate if orders can be found and retrieve the shipping gross field
      if (!order) {
        // console.log('cannot find order in database');
      } else {
        estimatedCost = order.ShippingGross;

        console.log((invoicedCost - estimatedCost) / estimatedCost);
        // Compare invoiced and estimated cost
        if (
          // Variance is less or more than threshold
          Math.abs(invoicedCost - estimatedCost) / estimatedCost >
          parseInt(process.env.VARIANCETHRESHOLD) / 100
        ) {
          // Create alert
          let alert = await Alert.findOne({
            OrderNumber: orderNumber,
          });

          if (!alert) {
            const alert = new Alert({
              OrderNumber: orderNumber,
              EstimatedCost: estimatedCost,
              ActualCost: invoicedCost,
            });
            alert.save();
          }
        }
      }
    }
  }
});

console.log(Math.abs(12 - 17.88) / 100);

// Testing - Application reachability
app.get('/', async (req, res) => {
  res.send('This is the updated order shipment');
});

// Testing - Load orders from mintsoft API
app.post('/loadorders', async (req, res) => {
  // Reset 'orders' database
  Order.deleteMany({});

  // Get API key
  const apiKey = await fetchApiKey();

  // API call to get list of orders
  const response = await axios.get(
    // If need specific order status, it can be added here. For example: orderStatusId=4 for despatched and orderStatusId=5 for invoiced
    `https://api.mintsoft.co.uk/api/Order/List?APIKey=${apiKey}
        `
  );

  // Store data into MongoDB 'orders' collection
  response.data.forEach((data) => {
    const order = new Order({
      OrderNumber: data.OrderNumber,
      ClientId: data.ClientId,
      DespatchDate: data.DespatchDate,
    });

    order.save();
  });

  res.send('orders loaded');
});

// App listeners
const PORT = parseInt(process.env.PORT) || 80;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
