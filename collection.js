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
    .select('movie_id, collected_at')
    .eq('user_id', user.id);

  

  if (error) return console.error(error);

  const container = document.getElementById("collection");
  container.innerHTML = "";

  for (const entry of data) {
    const res = await fetch(`${BASE_URL}/movie/${entry.movie_id}?api_key=${API_KEY}&language=en-US`);
    const movie = await res.json();

    const releaseDate = new Date(movie.release_date);
    const collectionDate = new Date(entry.collected_at);
    const CollectionformattedDate = collectionDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}); // e.g., "9/2/2025, 1:45:22 PM"

    const ReleaseformattedDate = releaseDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

    const div = document.createElement("div");
    div.classList.add("movie-card"); // Add the same class as index.html

    let rarityClass = collectionDate <= releaseDate ? "rare" : "normal";

              if (collectionDate <= releaseDate) {
 div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
       <p class="${rarityClass}">${movie.title}</p>
      <p class="${rarityClass}">Release Date: ${ReleaseformattedDate}</p>
      <p class="${rarityClass}">You collected ${movie.title} on ${CollectionformattedDate}.</p>
      <p class="${rarityClass}">Opening Night! (Variant)</p>
    `;
} else {
  div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
       <p class="${rarityClass}">${movie.title}</p>
      <h3>Release Date: ${ReleaseformattedDate}</h3>
      <h3>You collected ${movie.title} on ${CollectionformattedDate}.</h3>
    `;
}


    

    container.appendChild(div);
  }
}

loadCollection();
