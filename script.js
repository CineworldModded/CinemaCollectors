import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🔹 SUPABASE SETUP
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔹 AUTH FUNCTIONS
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

// 🔹 DISPLAY MOVIES
const IMG_URL = "https://image.tmdb.org/t/p/w500"; // For TMDb posters

async function displayMovies(movies) {
  const container = document.getElementById("movies");
  container.innerHTML = "";
  movies.forEach(movie => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <button onclick="collectMovie('${movie.id}')">Collect</button>
    `;
    container.appendChild(div);
  });
}

// Example: load TMDb movies from Supabase (replace with your actual movie fetching)
async function loadMovies() {
  const { data: movies, error } = await supabase.from('movies').select('*');
  if (error) console.log(error);
  else displayMovies(movies);
}

// 🔹 COLLECT MOVIE (STEP 7)
async function collectMovie(movieId) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const user = userData.user;
    if (!user) {
      alert("Please sign in first!");
      return;
    }

    const { data: movie, error: movieError } = await supabase
      .from('movies')
      .select('*')
      .eq('id', movieId)
      .single();
    if (movieError) throw movieError;

    if (movie.collected >= movie.limit) {
      alert("This movie is sold out!");
      return;
    }

    const { error: insertError } = await supabase
      .from('c
