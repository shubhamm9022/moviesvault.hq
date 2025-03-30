document.addEventListener("DOMContentLoaded", function () {
    const movieList = document.getElementById("movie-list");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    let movies = [];
    let currentPage = 1;
    const moviesPerPage = 10;

    // Replace this with your Google Sheet CSV link
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0D7_9n5fJGj30Erv8CEr3rz7UGPh3qdvSx79RiVCf2iuT_yZw51mr-9cdGxpyXbSPTbYXcuHC8cPk/pub?output=csv";

    async function fetchMovies() {
        try {
            const response = await fetch(sheetURL);
            const data = await response.text();
            parseCSV(data);
        } catch (error) {
            console.error("Error fetching movie data:", error);
        }
    }

    function parseCSV(data) {
        const rows = data.split("\n").slice(1); // Remove headers
        movies = rows.map(row => {
            const [title, year, poster, id] = row.split(",");
            return { title, year, poster, id: id.trim() };
        });

        movies.reverse(); // Show latest movies first
        renderMovies();
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
