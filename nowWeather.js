const minimist = require("minimist");
const axios = require("axios");
const apiUrl = "https://devapi.qweather.com/v7/weather/now";
const location = "101050311"; // location xian
// https://github.com/qwd/LocationList/blob/master/China-City-List-latest.csv
const lang = "zh";
// const apiKey = "";

const args = minimist(process.argv.slice(2), {
  string: "apiKey",
});

const apiKey = args.apiKey;
if (!apiKey) {
  console.error("apiKey is required for this command ");

  process.exit(1); // Exit with a non-zero status code to indicate an error
}
console.log("apiKey:", apiKey);

// Function to get weather information
async function getWeather() {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        location,
        lang,
        key: apiKey,
      },
    });

    // Assuming you want to log the response data for now
    // console.log("Weather Information:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error getting weather information:", error.message);
    throw error;
  }
}
module.exports = { getWeather };
