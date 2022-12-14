const axios = require('axios');
// Uncomment below for local hosting
// require('dotenv').config();

const fetchApiKey = async () => {
  try {
    const result = await axios.get(
      `https://api.mintsoft.co.uk/api/Auth?UserName=${process.env.MINTSOFTUSERNAME}&Password=${process.env.MINTSOFTPASSWORD}
            `
    );
    return result.data;
    console.log(result);
  } catch (err) {
    console.error(
      `${err.message}\nYour mintsoft username or password is invalid`
    );
    process.exit(1);
  }
};

module.exports = fetchApiKey;
