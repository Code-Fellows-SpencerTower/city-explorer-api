'use strict';

const axios = require('axios');
const cache = require('../cache');

// refactor to check query and recieve lat, lon
async function getWeatherData(lat, lon) {

  const key = 'weather-' + lat + lon;
  const weatherbitUrl = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}&units=I&days=7`;

  // check if data for query is in cache and up to date
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache data found');
  } else { // get new data via axios from weatherbit, parse, and update cache
    console.log('No cache data found');
    cache[key] = {}; // add obj to key in cache
    cache[key].timestamp = Date.now(); // add current date/time to timestamp in cache
    cache[key].data = parseWeatherData(await axios.get(weatherbitUrl)); // get current data from weatherbit
  }

  return cache[key].data;
}

// parse weather data with Forecast object constructor
function parseWeatherData(weatherData) {
  const forecast = weatherData.data.data.map(day => new Forecast(day));
  return forecast;
}

// handle req from client, pass to weather.js, send res to client
async function weatherReqHandler(req, res) {
  try {
    // assign lat lon from query to variables
    const { lat, lon } = req.query;
    // pass lat and lon into getWeather() in weather.js to get data from cache or new axios request
    const weatherData = await getWeatherData(lat, lon);
    res.status(200).send(weatherData);
  } catch (error) {
    // add error handler
    res.status(500).send(`There was an error retrieving weather data for ${req.query.city_name}.`);
  }
}

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `High of ${obj.max_temp}, Low of ${obj.low_temp}, with ${obj.weather.description} `;

  }
}

module.exports = weatherReqHandler;

