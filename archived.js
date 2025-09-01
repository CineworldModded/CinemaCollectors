import { supabase, requireAuth, goToCollection, goToHome, logout } from './auth.js';

const IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = "7903604122024e0b7efb57b94fa08ea7"; // Replace with your TMDb key
const BASE_URL = "https://api.themoviedb.org/3";

const moviesContainer = document.getElementById("movies");
const collectionBtn = document.getElementById("collectionBtn");
const logoutBtn = document.getElementById("logoutBtn");
const mainBtn = document.getElementById("mainBtn");

// Attach navigation functions
collectionBtn.onclick = goToCollection;
mainBtn.onclick = goToHome;
logoutBtn.onclick = logout;

// Ensure user is logged in
async function init() {
  await requireAuth();
  loadMovies();
}

// Fetch and display movies
async function loadMovies() {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    displayMovies(data.results);
  } catch (err) {
    console.error("Failed to load movies:", err);
    moviesContainer.innerHTML = "<p>Failed to load movies. Check API key or internet connection.</p>";
  }
}

// Render movie posters and Collect buttons
function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("movie-card");

    div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}" class="grayed">
      <h3>${movie.title}</h3>
    `;

    // Optional: if you want to still make the div clickable to collect later
    // div.onclick = () => collectMovie(movie);

    moviesContainer.appendChild(div);
  });
}


// Add movie to user's collection
async function collectMovie(movie) {
  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;
  if (!user) return alert("Please log in first!");

  const { error } = await supabase.from('collections').insert([
    { user_id: user.id, movie_id: movie.id.toString() } // Ensure movie_id is string
  ]);

  if (error) return alert("Error collecting movie: " + error.message);
  alert(`🎉 You collected "${movie.title}"!`);
}

init();




