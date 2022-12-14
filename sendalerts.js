const connectDB = require('./config/db');
const sendMail = require('./config/mail');
const Alert = require('./models/Alert');
// Uncomment below for local hosting
// require('dotenv').config();

// Database
connectDB();

// Every 24 hour or so, checks whether there are alerts to be sent
async function sendAlerts() {
  // Forming email body
  let html = '';
  let totalEstimated = 0;
  let totalActual = 0;

  // Find alerts that has not been alerted from MongoDB collection
  const alerts = await Alert.find(
    { Alerted: false },
    (err, docs) => {}
  ).clone();

  // Validate alerts not null and perform operation on each alert
  if (alerts) {
    alerts.forEach((alert) => {
      // Destructure and format alert
      const { OrderNumber, EstimatedCost, ActualCost } = alert;
      const dollarVariance = (EstimatedCost - ActualCost).toFixed(2);
      const percentVariance = ((dollarVariance / EstimatedCost) * 100).toFixed(
        2
      );

      // Add individual cost to total cost
      totalEstimated += EstimatedCost;
      totalActual += ActualCost;

      // Add to email body
      html += `<p>There is a ${dollarVariance}(${percentVariance}%) variance in object ${OrderNumber}. It is declared to be $${EstimatedCost}, but was invoiced $${ActualCost} instead.</p>`;

      // Set alerts to alerted
      const update = Alert.findByIdAndUpdate(
        alert.id,
        { Alerted: true },
        (err, docs) => {}
      );
    });
  }

  // Count the total variance
  const totalDollarVariance = (totalEstimated - totalActual).toFixed(2);
  const totalPercentVariance = (
    (totalDollarVariance / totalEstimated) *
    100
  ).toFixed(2);

  // Add total variance to email body
  if (totalPercentVariance > parseInt(process.env.TOTALVARIANCETHRESHOLD)) {
    html += `<p><strong>The total variance is ${totalDollarVariance}(${totalPercentVariance}%). The total estimated cost is $${totalEstimated}, but the actual cost is $${totalActual}.<strong></p>`;
  }

  // Send the email
  sendMail(html);
}

sendAlerts();
