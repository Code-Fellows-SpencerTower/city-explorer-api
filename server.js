'use strict';

// not using import, using require instead
// requires/imports express
require('dotenv').config(); // lets you use env file
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json');
const app = express(); // gives back return value
app.use(cors()); // acts as middleware - intermediary between server and requests

// opens up a route for /weather, calls handleGetWeather when route recieves query
app.get('/weather', handleGetWeather);
// send error back to client if page not found
app.get('/*', (req, res) => res.status(404).send('Route Not Found'));
// turn on server
app.listen(process.env.PORT, () => console.log('server is listening on PORT 3001'));


async function handleGetWeather(req, res) {
  // set up endpoint to accept city_name as param
  let city_name = req.query.city_name;
  //let cities_in_data = ['Seattle', 'Paris', 'Ammon'];
  let city_match = weatherData.find(city => city.city_name.toLowerCase() === city_name.toLowerCase());
  console.log('city_match', city_match);

  if (city_match) {
    // map to Forecast, returns obj with datetime and description as properties
    const resWeatherData = city_match.data.map(day => new Forecast(day));
    // send city weather data description to client
    // console.log(resWeatherData);
    res.status(200).send(resWeatherData);

  } else {
    // if not found, send error to client
    const liveWeather = await axios.get(`http://api.weatherbit.io/v2.0/forecast/daily?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I`);
    // makes new property on weather object for searched city
    weatherData[liveWeather.data.city_name] = liveWeather.data;
    console.log(liveWeather);
    res.status(400).send(`${city_name} not found.`);
  }


  // let newForecast = weatherData.map(location => new Forecast(location));
  // sends back datetime
}

class Forecast {
  constructor(object) {
    this.date = object.datetime;
    this.description = `High of ${object.max_temp}, Low of ${object.low_temp}, with ${object.weather.description}`;

  }
}




