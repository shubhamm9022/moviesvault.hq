document.addEventListener("DOMContentLoaded", async function () {
    const supabaseUrl = 'https://tymkbfpmbgrdxgvqpgzo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bWtiZnBtYmdyZHhndnFwZ3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjQyOTYsImV4cCI6MjA1OTQwMDI5Nn0.9ZT2oHJn-QYBNk8KWEbM25UVtz5W1-fcnRehVADyx7o';

    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const movieList = document.getElementById("movie-list");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const categoryBtns = document.querySelectorAll(".category-btn");

    let movies = [];
    let filteredMovies = [];
    let currentPage = 1;
    const moviesPerPage = 12;
    let currentCategory = "all";
    let currentSearch = "";

    function isValidUrl(str) {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    }

    async function fetchMovies() {
        const { data, error } = await supabase
            .from("movies")
            .select("*");

        if (error) {
            console.error("Error fetching movies:", error.message);
            movieList.innerHTML = `<p style="text-align:center; color:red;">Failed to load movies.</p>`;
            return;
        }

        movies = data.reverse(); // Show newest first
        filterAndRenderMovies();
    }

    function filterAndRenderMovies() {
        filteredMovies = movies.filter(movie => {
            const matchesCategory = currentCategory === "all" || movie.category?.toLowerCase() === currentCategory.toLowerCase();
            const matchesSearch = movie.title?.toLowerCase().includes(currentSearch.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        renderMovies();
    }

    function renderMovies() {
        movieList.innerHTML = "";

        const start = (currentPage - 1) * moviesPerPage;
        const end = start + moviesPerPage;
        const pageMovies = filteredMovies.slice(start, end);

        if (pageMovies.length === 0) {
            movieList.innerHTML = "<p style='text-align:center; color:white;'>No movies found.</p>";
            return;
        }

        pageMovies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.className = "movie-container fade-in";
            movieCard.innerHTML = `
                <img class="movie-poster" src="${isValidUrl(movie.image_url) ? movie.image_url : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.title}">
                <div class="movie-title">${movie.title}</div>
            `;
            movieCard.addEventListener("click", () => {
                window.location.href = `/movie.html?slug=${movie.slug}`;
            });
            movieList.appendChild(movieCard);
        });
    }

    // Search functionality
    searchBtn.addEventListener("click", () => {
        currentSearch = searchInput.value.trim();
        currentPage = 1;
        filterAndRenderMovies();
    });

    // Category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.dataset.category;
            currentPage = 1;
            filterAndRenderMovies();
        });
    });

    // Pagination buttons
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderMovies();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderMovies();
        }
    });

    // Initial load
    await fetchMovies();
});
