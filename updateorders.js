const axios = require('axios');
const connectDB = require('./config/db');
const fetchApiKey = require('./config/api');
const Order = require('./models/Order');
// Uncomment below for local hosting
// require('dotenv').config();

// Database
connectDB();

// Every 24 hours, orders in MongoDB are updated with estimated shipping cost
async function updateOrders() {
  try {
    // Retrieve api
    let apiKey = await fetchApiKey();

    // Find order that has not been updated indicated by { shipping gross = -1 }
    const orders = await Order.find(
      { ShippingGross: -1 },
      async (err, docs) => {
        // For each order, fetch the order from Mintsoft using Mintsoft API
        docs.forEach(async (order) => {
          let iOrder = await fetchInvoicedOrder(apiKey, order.OrderNumber);

          // Validate order can be found and shipping gross has been updated
          if (iOrder && iOrder.ShippingGross) {
            // Update the order in MongoDB
            await Order.findOneAndUpdate(
              { OrderNumber: order.OrderNumber },
              { ShippingGross: iOrder.ShippingGross }
            );
          }
        });
      }
    )
      // Since query is repeated, clone function is needed
      .clone();
  } catch (error) {
    console.error(error);
  }
}

// Fetch specific order from Mintsoft
async function fetchInvoicedOrder(apiKey, orderNumber) {
  // API call - search order by order number
  const response = await axios.get(
    `https://api.mintsoft.co.uk/api/Order/Search?APIKey=${apiKey}&OrderNumber=${orderNumber}
    `
  );

  // Return the best match in the list
  return response.data[0];
}

updateOrders();
