document.addEventListener("DOMContentLoaded", function () {
    // Initialize Supabase
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

    async function fetchMovies() {
        try {
            let { data, error } = await supabase
                .from('movies')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            
            movies = data.map(movie => ({
                id: movie.id,
                title: movie.title,
                year: movie.year,
                poster: movie.poster,
                stream: movie.streamlink,
                download: movie.downloadlink,
                category: movie.genre.toLowerCase(),
                description: movie.description,
                slug: movie.slug
            }));

            filteredMovies = [...movies];
            renderMovies();
        } catch (error) {
            console.error("Error fetching movies:", error);
            movieList.innerHTML = `<p class="error">Error loading movies. Please try again later.</p>`;
        }
    }

    function renderMovies() {
        movieList.innerHTML = "";
        const start = (currentPage - 1) * moviesPerPage;
        const end = start + moviesPerPage;
        const paginatedMovies = filteredMovies.slice(start, end);

        if (paginatedMovies.length === 0) {
            movieList.innerHTML = `<p class="no-results">No movies found. Try a different search or category.</p>`;
            return;
        }

        paginatedMovies.forEach(movie => {
            const movieContainer = document.createElement("div");
            movieContainer.classList.add("movie-container");
            movieContainer.innerHTML = `
                <img src="${movie.poster}" class="movie-poster" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/200x300?text=Poster+Not+Available'">
                <p class="movie-title">${movie.title} (${movie.year})</p>
            `;
            movieContainer.addEventListener("click", () => {
                window.location.href = `movie.html?id=${movie.id}`;
            });
            movieList.appendChild(movieContainer);
        });

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = end >= filteredMovies.length;
    }

    // Event Listeners (same as before)
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderMovies();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage * moviesPerPage < filteredMovies.length) {
            currentPage++;
            renderMovies();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    function handleSearch() {
        const searchQuery = searchInput.value.toLowerCase();
        filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(searchQuery) && 
            (currentCategory === "all" || movie.category === currentCategory)
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

    fetchMovies();
});
// Add lazy loading for images in app.js
movieContainer.innerHTML = `
    <img loading="lazy" src="${movie.poster}" class="movie-poster" 
         alt="${movie.title}" 
         onerror="this.src='https://via.placeholder.com/200x300?text=Poster+Not+Available'">
    <p class="movie-title">${movie.title} (${movie.year})</p>
`;
