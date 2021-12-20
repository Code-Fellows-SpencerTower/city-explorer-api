'use strict';

const axios = require('axios');
const cache = require('../cache');

// refactor to check query and recieve lat, lon
async function getMovieData(city_name) {

  const key = 'movie-' + city_name;
  const moviedbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city_name}&adult=false`;

  // check if data for query is in cache and up to date by 1 day
  if (cache[key] && (Date.now() - cache[key].timestamp < (3600 * 1000 * 24))) {
    console.log('Cache data found');
  } else { // get new data via axios from movie db, parse, and update cache
    console.log('No cache data found');
    cache[key] = {}; // add obj to key in cache
    cache[key].timestamp = Date.now(); // add current date/time to timestamp in cache
    cache[key].data = parseMovieData(await axios.get(moviedbUrl)); // get current data from movie db
  }

  return cache[key].data;
}

function parseMovieData(movieData) {
  const movie = movieData.data.results.map(day => new Movie(day));
  return movie;
}

// handle req from client, pass to movies.js, send res to client
async function movieReqHandler(req, res) {
  try {
    // assign lat lon from query to variables
    const { city_name } = req.query;
    // pass lat and lon into getWeather() in weather.js to get data from cache or new axios request
    const movieData = await getMovieData(city_name);
    res.status(200).send(movieData);
  } catch (error) {
    // add error handler
    res.status(500).send(`There was an error retrieving movie data for ${req.query.city_name}.`);
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

module.exports = movieReqHandler;
