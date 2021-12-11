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
const handleGetWeather = require('./routeHandlers/weather');

// open route for weather
app.get('/weather', handleGetWeather);
// open route for movies
app.get('/movies', handleGetMovie);
// send error back to client if page not found
app.get('/*', (req, res) => res.status(404).send('Route Not Found'));
// turn on server
app.listen(process.env.PORT, () => console.log('server is listening on PORT 3001'));




async function handleGetMovie(req, res) {
  try {
    const movieData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.city_name}&adult=false`);
    // map into new Movie obj, put in variable to send back to client
    const movieRes = movieData.data.results.map(movie => new Movie(movie));
    console.log(movieRes);
    res.status(200).send(movieRes);
  } catch (error) {
    res.status(500).send(`There was server error retrieving movie data for ${req.query.city_name}.`);
  }
}

class Movie {
  constructor(obj) {
    this.title = obj.original_title;
    this.overview = obj.overview;
    this.avg_votes = obj.vote_average;
    this.total_votes = obj.vote_count;
    this.img_url = obj.poster_path ? `https://image.tmdb.org/t/p/w500${obj.poster_path}` : 'https://www.lacinefest.org/uploads/2/6/7/4/26743637/no-poster_orig.jpeg';
    this.popularity = obj.popularity;
    this.release_date = obj.release_date;
  }
}


