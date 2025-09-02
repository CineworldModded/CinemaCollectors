import { supabase, requireAuth, goToCollection, goToArchive, logout } from './auth.js';

const IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = "7903604122024e0b7efb57b94fa08ea7"; // Replace with your TMDb key
const BASE_URL = "https://api.themoviedb.org/3";

const moviesContainer = document.getElementById("movies");
const collectionBtn = document.getElementById("collectionBtn");
const logoutBtn = document.getElementById("logoutBtn");
const archiveBtn = document.getElementById("archiveBtn");

// Attach navigation functions
collectionBtn.onclick = goToCollection;
archiveBtn.onclick = goToArchive;
logoutBtn.onclick = logout;

// Ensure user is logged in
async function init() {
  await requireAuth();
  loadMovies();
}

// Fetch and display movies
async function loadMovies() {
  try {
    const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    displayMovies(data.results);
  } catch (err) {
    console.error("Failed to load movies:", err);
    moviesContainer.innerHTML = "<p>Failed to load movies. Check API key or internet connection.</p>";
  }
}

// Render movie posters and Collect buttons
async function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;

  // Get all movie IDs the user has collected
  let collectedIds = [];
  if (user) {
    const { data: collected } = await supabase
      .from('collections')
      .select('movie_id')
      .eq('user_id', user.id);
    collectedIds = collected.map(c => c.movie_id);
  }

  movies.forEach(movie => {

    if (movie.banned) return alert("This movie is banned and cannot be collected.");

    const div = document.createElement("div");
    div.classList.add("movie-card");

    // Check if this movie is already collected
    const isCollected = collectedIds.includes(movie.id.toString());
    const moviesLeft = movie.total_stock - movie.collected;

    // <h3>Movies Left: ${moviesLeft}</h3>

    div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
     
      <button class="collectBtn" ${isCollected ? "disabled" : ""}>
        ${isCollected ? "Collected" : "Collect"}
      </button>
    `;

    if (!isCollected) {
      div.querySelector(".collectBtn").onclick = () => collectMovie(movie);
    }

    moviesContainer.appendChild(div);
  });
}


// Add movie to user's collection
async function collectMovie(movie) {
  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;
  if (!user) return alert("Please log in first!");

  // 1️⃣ Check if already collected
  const { data: existing, error: checkError } = await supabase
    .from('collections')
    .select('id')
    .eq('user_id', user.id)
    .eq('movie_id', movie.id.toString())
    .single(); // gets one row if exists

  if (existing) {
    return alert(`You already collected "${movie.title}"!`);
  }

  if (movie.banned) return alert("This movie is banned and cannot be collected.");


  // 2️⃣ Insert new collection
  const { error } = await supabase.from('collections').insert([
    { user_id: user.id, movie_id: movie.id.toString() }
  ]);

  if (error) return alert("Error collecting movie: " + error.message);

  alert(`🎉 You collected "${movie.title}"!`);

  // 3️⃣ Optionally refresh UI to disable button
  loadMovies();
}


init();




