// Updated app.js document.addEventListener("DOMContentLoaded", function () { const movieList = document.getElementById("movie-list"); const prevPageBtn = document.getElementById("prevPage"); const nextPageBtn = document.getElementById("nextPage"); let movies = []; let currentPage = 1; const moviesPerPage = 10;

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
    const rows = data.split("\n").slice(1);
    movies = rows.map(row => {
        const columns = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        return {
            title: columns[0].replace(/"/g, ''),
            year: columns[1],
            poster: columns[2],
            id: columns[3].trim()
        };
    });
    
    movies.reverse();
    renderMovies(movies);
}

function renderMovies(movieArray) {
    movieList.innerHTML = "";
    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const paginatedMovies = movieArray.slice(start, end);

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
    nextPageBtn.disabled = end >= movieArray.length;
}

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderMovies(movies);
    }
});

nextPageBtn.addEventListener("click", () => {
    if (currentPage * moviesPerPage < movies.length) {
        currentPage++;
        renderMovies(movies);
    }
});

document.getElementById("searchInput").addEventListener("input", function () {
    const searchQuery = this.value.toLowerCase();
    const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchQuery));
    renderMovies(filteredMovies);
});

fetchMovies();

});

