document.addEventListener("DOMContentLoaded", async function () {
    const supabaseUrl = 'https://tymkbfpmbgrdxgvqpgzo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bWtiZnBtYmdyZHhndnFwZ3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjQyOTYsImV4cCI6MjA1OTQwMDI5Nn0.9ZT2oHJn-QYBNk8KWEbM25UVtz5W1-fcnRehVADyx7o'; // Replace with your actual anon/public key
    const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

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
        const { data, error } = await supabaseClient
            .from("movies")
            .select("*");

        if (error) {
            console.error("Error fetching movies:", error.message);
            return;
        }

        movies = data;
        filterAndRenderMovies();
    }

    function filterAndRenderMovies() {
        filteredMovies = movies.filter(movie => {
            const matchesCategory = currentCategory === "all" || movie.category.toLowerCase() === currentCategory.toLowerCase();
            const matchesSearch = movie.title.toLowerCase().includes(currentSearch.toLowerCase());
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
            movieCard.className = "movie-card";
            movieCard.innerHTML = `
                <img src="${isValidUrl(movie.image_url) ? movie.image_url : 'default.jpg'}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.category}</p>
                <a href="${movie.download_link}" target="_blank">Download</a>
            `;
            movieList.appendChild(movieCard);
        });
    }

    searchBtn.addEventListener("click", () => {
        currentSearch = searchInput.value.trim();
        currentPage = 1;
        filterAndRenderMovies();
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.dataset.category;
            currentPage = 1;
            filterAndRenderMovies();
        });
    });

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
