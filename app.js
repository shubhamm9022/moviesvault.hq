document.addEventListener("DOMContentLoaded", function () {
    const movieList = document.getElementById("movie-list");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    let movies = [];
    let currentPage = 1;
    const moviesPerPage = 10;

    function fetchMovies() {
        fetch("movies.json") // Replace with Firebase fetch logic
            .then(response => response.json())
            .then(data => {
                movies = data;
                renderMovies();
            });
    }

    function renderMovies() {
        movieList.innerHTML = "";
        const start = (currentPage - 1) * moviesPerPage;
        const end = start + moviesPerPage;
        const paginatedMovies = movies.slice(start, end);

        paginatedMovies.forEach(movie => {
            const movieContainer = document.createElement("div");
            movieContainer.classList.add("movie-container");
            movieContainer.innerHTML = `
                <img src="${movie.poster}" class="movie-poster" alt="${movie.title}">
                <p class="movie-title">${movie.title} (${movie.year})</p>
            `;
            movieContainer.addEventListener("click", () => {
                window.location.href = `movie.html?id=${movie.id}`;
            });
            movieList.appendChild(movieContainer);
        });

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = end >= movies.length;
    }

    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderMovies();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage * moviesPerPage < movies.length) {
            currentPage++;
            renderMovies();
        }
    });

    fetchMovies();
});
