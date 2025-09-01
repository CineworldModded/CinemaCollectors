import { supabase } from './supabaseClient.js'; // your Supabase client
const TMDB_API_KEY = '7903604122024e0b7efb57b94fa08ea7';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchMovies(page = 1, type = 'now_playing') {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return data.results;
}

async function populateAllMovies() {
  const today = new Date();

  // You can loop through multiple pages if needed
  let page = 1;
  let movies;

  do {
    movies = await fetchMovies(page);

    for (const movie of movies) {
      const releaseDate = new Date(movie.release_date);
      const inTheatres = releaseDate > today ? true : false; // mark archived or current

      await supabase.from('movies').upsert({
        tmdb_id: movie.id,
        title: movie.title,
        poster_path: `${IMG_BASE_URL}${movie.poster_path}`,
        limit: 100,        // max collectors
        collected: 0,
        in_theatres: inTheatres
      }, { onConflict: ['tmdb_id'] });
    }

    page++;
  } while (movies && movies.length > 0);

  console.log('Movies table repopulated!');
}

populateAllMovies()
  .then(() => console.log('Done!'))
  .catch(err => console.error(err));
