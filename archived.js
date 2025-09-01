import { supabase, requireAuth } from './auth.js';

async function loadArchivedMovies() {
  const user = await requireAuth();
  if (!user) return;

  // 1️⃣ Fetch archived movies
  const { data: archivedMovies, error: moviesError } = await supabase
    .from('movies')
    .select('*')
    .eq('in_theatres', false)
    .order('tmdb_id', { ascending: false });

  if (moviesError) return console.error('Error fetching movies:', moviesError);

  // 2️⃣ Fetch user's collection
  const { data: userCollection } = await supabase
    .from('collections')
    .select('movie_id')
    .eq('user_id', user.id);

  const collectedIds = userCollection.map(m => m.movie_id);

  // 3️⃣ Render movies
  const container = document.getElementById('archived-movies');
  container.innerHTML = ''; // clear old content

  archivedMovies.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('movie-card');

    const isCollected = collectedIds.includes(movie.tmdb_id);

    div.innerHTML = `
      <img src="${movie.poster_path}" alt="${movie.title}" class="${isCollected ? '' : 'grayed'}">
      <h3>${movie.title}</h3>
    `;

    container.appendChild(div);
  });
}

// Load archived movies on page load
loadArchivedMovies();
