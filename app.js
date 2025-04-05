document.addEventListener("DOMContentLoaded", function () {
  const supabaseUrl = 'https://tymkbfpmbgrdxgvqpgzo.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bWtiZnBtYmdyZHhndnFwZ3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjQyOTYsImV4cCI6MjA1OTQwMDI5Nn0.9ZT2oHJn-QYBNk8KWEbM25UVtz5W1-fcnRehVADyx7o'; // ← Use your real anon key
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  const movieList = document.getElementById("movie-list");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  async function fetchMovies() {
    try {
      movieList.innerHTML = '<div class="loading">Loading movies...</div>';
      const { data: movies, error } = await supabase
        .from('movies')
        .select('*')
        // .order('created_at', { ascending: false }); ← Commented out if null

      if (error) throw error;
      if (!movies || movies.length === 0) {
        movieList.innerHTML = '<div class="error">No movies found.</div>';
        return;
      }

      renderMovies(movies);
    } catch (error) {
      movieList.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
  }

  function renderMovies(movies) {
    movieList.innerHTML = "";
    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("movie-card");

      card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p><strong>Year:</strong> ${movie.year}</p>
        <p><strong>Genre:</strong> ${movie.genre}</p>
        <div class="btn-group">
          ${movie.streamlink ? `<a href="${movie.streamlink}" target="_blank">Watch</a>` : ""}
          ${movie.downloadlink ? `<a href="${movie.downloadlink}" target="_blank">Download</a>` : ""}
        </div>
      `;
      movieList.appendChild(card);
    });
  }

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();
    filterMovies(query);
  });

  function filterMovies(query) {
    const cards = document.querySelectorAll(".movie-card");
    cards.forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = title.includes(query) ? "block" : "none";
    });
  }

  fetchMovies();
});

