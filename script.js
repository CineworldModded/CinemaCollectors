const API_KEY = "7903604122024e0b7efb57b94fa08ea7"; // Replace with your TMDb API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// Fetch movies currently in theaters
async function getMovies() {
  try {
    const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    displayMovies(data.results);
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
}

// Display movies on the page
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

// Run on page load
getMovies();
