document.addEventListener("DOMContentLoaded", async function () {
    const supabaseUrl = 'https://tymkbfpmbgrdxgvqpgzo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bWtiZnBtYmdyZHhndnFwZ3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjQyOTYsImV4cCI6MjA1OTQwMDI5Nn0.9ZT2oHJn-QYBNk8KWEbM25UVtz5W1-fcnRehVADyx7o'; 
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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

    function isValidUrl(str) {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }

    async function fetchMovies() {
        movieList.innerHTML = `<div class="skeleton-container">${Array(moviesPerPage).fill().map(() => `
            <div class="movie-container">
                <div class="skeleton skeleton-poster"></div>
                <div class="skeleton skeleton-text" style="width:80%"></div>
                <div class="skeleton skeleton-text" style="width:60%"></div>
            </div>
        `).join('')}</div>`;

        try {
            const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
            if (error) throw error;

            movies = data.map(movie => ({
                id: movie.id,
                title: movie.title || "Untitled Movie",
                year: movie.year || "N/A",
                genre: (movie.genre || "uncategorized").toLowerCase().replace(/\s+/g, "-"),
                poster: movie.poster || 'https://via.placeholder.com/200x300?text=No+Poster',
                streamlink: isValidUrl(movie.streamlink) ? movie.streamlink : null,
                downloadlink: isValidUrl(movie.downloadlink) ? movie.downloadlink : null,
                slug: (movie.slug || "").trim(),
                description: movie.description || "No description available"
            }));

            filteredMovies = movies.filter(m => m.poster);
            renderMovies();
        } catch (err) {
            console.error("Error loading movies:", err);
            movieList.innerHTML = `<div class="error"><p>Failed to load movies. Try refreshing.</p><button onclick="window.location.reload()">Retry</button></div>`;
        }
    }

    function renderMovies() {
        movieList.innerHTML = "";
        const start = (currentPage - 1) * moviesPerPage;
        const end = start + moviesPerPage;
        const pageMovies = filteredMovies.slice(start, end);

        if (pageMovies.length === 0) {
            movieList.innerHTML = `<p class="no-results">No movies found.</p>`;
            return;
        }

        pageMovies.forEach(movie => {
            const div = document.createElement("div");
            div.classList.add("movie-container");
            div.innerHTML = `
                <img loading="lazy" src="${movie.poster}" class="movie-poster" alt="${movie.title}" 
                    onerror="this.src='https://via.placeholder.com/200x300?text=No+Poster';">
                <p class="movie-title">${movie.title} (${movie.year})</p>
            `;
            div.addEventListener("click", () => {
                window.location.href = `movie.html?slug=${movie.slug}`;
            });
            movieList.appendChild(div);
        });

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = end >= filteredMovies.length;
    }

    function handleSearch() {
        const query = searchInput.value.toLowerCase();
        filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(query) &&
            (currentCategory === "all" || movie.genre === currentCategory)
        );
        currentPage = 1;
        renderMovies();
    }

    searchInput.addEventListener("input", handleSearch);
    searchBtn.addEventListener("click", handleSearch);

    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.dataset.category;
            handleSearch();
        });
    });

    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderMovies();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage * moviesPerPage < filteredMovies.length) {
            currentPage++;
            renderMovies();
        }
    });

    await fetchMovies();
});

