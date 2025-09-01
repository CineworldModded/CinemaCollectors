import { supabase, requireAuth, goToCollection, logout } from './auth.js';

const IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = "7903604122024e0b7efb57b94fa08ea7";
const BASE_URL = "https://api.themoviedb.org/3";

window.goToCollection = goToCollection;
window.logout = logout;

// Load movies on page
async function loadMovies() {
  await requireAuth(); // Redirect to login if not logged in

  try {
    const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    displayMovies(data.results);
  } catch (err) {
    console.error(err);
  }
}

function displayMovies(movies) {
  const container = document.getElementById("movies");
  container.innerHTML = "";

  movies.forEach(movie => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <button onclick="collectMovie('${movie.id}', '${movie.title}')">Collect</button>
    `;
    container.appendChild(div);
  });
}

// Collect movie function
window.collectMovie = async (movieId, title) => {
  const user = await requireAuth();
  if (!user) return;

  const { error } = await supabase.from('collections').insert([{ user_id: user.id, movie_id: movieId }]);
  if (error) return alert(error.message);

  alert(`🎉 You collected "${title}"!`);
};

loadMovies();
