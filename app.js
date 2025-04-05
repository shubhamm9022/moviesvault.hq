document.addEventListener("DOMContentLoaded", async function () {
  const supabase = supabase.createClient(
    'https://ordokuezdipglyivqwus.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZG9rdWV6ZGlwZ2x5aXZxd3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzAzMzcsImV4cCI6MjA1OTQ0NjMzN30.cEQ5G4b83Hd-lnfBKm6wLPZwa2mwpVY78tqFBuWdvjY'
  );

  const movieList = document.getElementById("movie-list");

  async function fetchMovies() {
    movieList.innerHTML = '<div class="loading">Loading movies...</div>';
    
    const { data: movies, error } = await supabase
      .from('movie_details') // <-- UPDATED table name
      .select(`
        id,
        title,
        year,
        genre,
        poster,
        streamlink,
        downloadlink,
        slug,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
      movieList.innerHTML = `
        <div class="error">
          Error fetching movies. Please try again.
        </div>
      `;
      return;
    }

    if (!movies || movies.length === 0) {
      movieList.innerHTML = `<p>No movies found.</p>`;
      return;
    }

    renderMovies(movies);
  }

  function renderMovies(movies) {
    movieList.innerHTML = '';
    
    movies.forEach(movie => {
      const movieEl = document.createElement('div');
      movieEl.className = 'movie-card';
      movieEl.innerHTML = `
        <img src="${movie.poster || 'https://via.placeholder.com/300x450'}"
             alt="${movie.title}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x450'">
        <h3>${movie.title}</h3>
        <p>${movie.year || 'Year N/A'}</p>
        <p class="genre">${movie.genre || 'No genre'}</p>
      `;
      movieEl.addEventListener('click', () => {
        window.location.href = \`movie.html?id=\${movie.id}\`;
      });
      movieList.appendChild(movieEl);
    });
  }

  fetchMovies();
});
