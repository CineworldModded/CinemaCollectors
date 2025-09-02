import { supabase, requireAuth, goToHome, logout } from './auth.js';
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "7903604122024e0b7efb57b94fa08ea7";

window.goToHome = goToHome;
window.logout = logout;

async function loadCollection() {
  const user = await requireAuth();
  if (!user) return;

  const { data, error } = await supabase
    .from('collections')
    .select('movie_id')
    .eq('user_id', user.id);

  if (error) return console.error(error);

  const container = document.getElementById("collection");
  container.innerHTML = "";

  for (const entry of data) {
    const res = await fetch(`${BASE_URL}/movie/${entry.movie_id}?api_key=${API_KEY}&language=en-US`);
    const movie = await res.json();

    const div = document.createElement("div");
    div.classList.add("movie-card"); // Add the same class as index.html

    div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <h3>${movie.collected_at}</h3>
    `;

    container.appendChild(div);
  }
}

loadCollection();
