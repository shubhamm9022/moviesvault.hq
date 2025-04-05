document.addEventListener("DOMContentLoaded", function() {
  // 1. Initialize Supabase
  const supabaseUrl = 'https://tymkbfpmbgrdxgvqpgzo.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bWtiZnBtYmdyZHhndnFwZ3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjQyOTYsImV4cCI6MjA1OTQwMDI5Nn0.9ZT2oHJn-QYBNk8KWEbM25UVtz5W1-fcnRehVADyx7o';
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  // 2. DOM Elements
  const movieList = document.getElementById("movie-list");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  
  // 3. Fetch Movies with Error Handling
  async function fetchMovies() {
    try {
      // Show loading state
      movieList.innerHTML = '<div class="loading">Loading movies...</div>';
      
      const { data: movies, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!movies || movies.length === 0) {
        movieList.innerHTML = '<div class="error">No movies found in database.</div>';
        return;
      }

      renderMovies(movies);
    } catch (error) {
      console.error("Fetch error:", error);
      movieList.innerHTML = `
        <div class="error">
          Failed to load movies. 
          <button onclick="window.location.reload()">Retry</button>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  // 4. Render Movies
  function renderMovies(movies) {
    movieList.innerHTML = '';
    
    movies.forEach(movie => {
      const movieEl = document.createElement('div');
      movieEl.className = 'movie-card';
      movieEl.innerHTML = `
        <img src="${movie.poster || 'https://via.placeholder.com/300x450'}" 
             alt="${movie.title}" 
             onerror="this.src='https://via.placeholder.com/300x450'">
        <h3>${movie.title}</h3>
        <p>${movie.year || 'Year N/A'}</p>
      `;
      movieEl.addEventListener('click', () => {
        window.location.href = `movie.html?id=${movie.id}`;
      });
      movieList.appendChild(movieEl);
    });
  }

  // 5. Search Functionality
  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    // You'll need to implement search logic
    console.log("Searching for:", searchTerm);
  }

  // 6. Event Listeners
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // 7. Initial Load
  fetchMovies();
});
