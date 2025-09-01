import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://tmjwmxgzdwhqgysvvjrz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtandteGd6ZHdocWd5c3Z2anJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzE3MDUsImV4cCI6MjA3MjMwNzcwNX0.vfBArYNc_Q_DJQGogWCaGuAl-YLYZkhTGI5zwEsfo7Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Check your email to confirm your account!");
}

async function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else alert("Signed in!");
}


const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

async function getMovies() {
  const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  displayMovies(data.results);
}

async function collectMovie(movieId) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    alert("Please sign in first!");
    return;
  }

  // Get movie info
  const { data: movie } = await supabase
    .from('movies')
    .select('*')
    .eq('id', movieId)
    .single();

  if (!movie) return alert("Movie not found.");
  if (movie.collected >= movie.limit) return alert("This movie is sold out!");

  // Insert into collections
  const { error: insertError } = await supabase
    .from('collections')
    .insert([{ user_id: user.id, movie_id: movieId }]);

  if (insertError) return alert(insertError.message);

  // Increment collected count
  const { error: updateError } = await supabase
    .from('movies')
    .update({ collected: movie.collected + 1 })
    .eq('id', movieId);

  if (updateError) return alert(updateError.message);

  alert("Movie collected!");
}

async function loadCollection() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { data: collection } = await supabase
    .from('collections')
    .select('movies(title, poster_path)')
    .eq('user_id', user.id);

  const container = document.getElementById("movies");
  container.innerHTML = "";
  collection.forEach(entry => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${entry.movies.poster_path}" alt="${entry.movies.title}">
      <h3>${entry.movies.title}</h3>
    `;
    container.appendChild(div);
  });
}


function displayMovies(movies) {
  const container = document.getElementById("movies");
  container.innerHTML = "";
  movies.forEach(movie => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
    `;
    container.appendChild(div);
  });
}

getMovies();
