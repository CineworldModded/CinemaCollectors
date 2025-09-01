const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

async function getMovies() {
  const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  displayMovies(data.results);
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
