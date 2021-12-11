'use strict';

async function handleGetWeather(req, res) {

  console.log(req.query);

  try {
    const liveWeather = await axios.get(`http://api.weatherbit.io/v2.0/forecast/daily?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I&days=7`);
    console.log(liveWeather.data);
    const liveWeatherRes = liveWeather.data.data.map(day => new Forecast(day));
    // send city weather data description to client
    res.status(200).send(liveWeatherRes);
  } catch (error) {

    res.status(400).send(`There was an error retrieving weather data for ${req.query.city_name}.`);
  }
}

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `High of ${obj.max_temp}, Low of ${obj.low_temp}, with ${obj.weather.description} `;

  }
}

module.exports = handleGetWeather;

