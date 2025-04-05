document.addEventListener("DOMContentLoaded", async function() {
  // Initialize Supabase with better configuration
  const supabase = supabase.createClient(
    'https://tymkbfpmbgrdxgvqpgzo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bWtiZnBtYmdyZHhndnFwZ3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjQyOTYsImV4cCI6MjA1OTQwMDI5Nn0.9ZT2oHJn-QYBNk8KWEbM25UVtz5W1-fcnRehVADyx7o',
    {
      db: {
        schema: 'public'
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );

  // DOM Elements
  const movieList = document.getElementById("movie-list");
  
  // Debug function to test connection
  async function testConnection() {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('id')
        .limit(1);
      
      if (error) throw error;
      console.log("Connection test successful:", data);
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }

  // Enhanced fetch function
  async function fetchMovies() {
    movieList.innerHTML = '<div class="loading">Loading movies...</div>';
    
    try {
      // First verify connection
      if (!await testConnection()) {
        throw new Error("Could not connect to Supabase");
      }

      // Fetch data with explicit column selection
      const { data: movies, error } = await supabase
        .from('movies')
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

      if (error) throw error;
      
      if (!movies || movies.length === 0) {
        movieList.innerHTML = `
          <div class="error">
            No movies found. 
            <button onclick="fetchMovies()">Try Again</button>
          </div>
        `;
        return;
      }

      renderMovies(movies);
    } catch (error) {
      console.error("Fetch error:", error);
      movieList.innerHTML = `
        <div class="error">
          Error: ${error.message}
          <button onclick="fetchMovies()">Retry</button>
          <p>Check console for details</p>
        </div>
      `;
    }
  }

  function renderMovies(movies) {
    movieList.innerHTML = '';
    
    movies.forEach(movie => {
      const movieEl = document.createElement('div');
      movieEl.className = 'movie-card';
      movieEl.innerHTML = `
        <img src="${movie.poster || 'https://via.placeholder.com/300x450'}" 
             alt="${movie.title}" 
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x450'">
        <h3>${movie.title}</h3>
        <p>${movie.year || 'Year N/A'}</p>
        <p class="genre">${movie.genre || 'No genre'}</p>
      `;
      movieEl.addEventListener('click', () => {
        window.location.href = `movie.html?id=${movie.id}`;
      });
      movieList.appendChild(movieEl);
    });
  }

  // Initial load
  fetchMovies();
});
console.log("Connecting to Supabase...");

const supabase = supabase.createClient('your-url', 'your-key');

async function fetchMovies() {
  const { data, error } = await supabase.from("movies").select("*");
  console.log("Fetched:", data, error);
}
