document.addEventListener("DOMContentLoaded", function () { const movieList = document.getElementById("movie-list"); const prevPageBtn = document.getElementById("prevPage"); const nextPageBtn = document.getElementById("nextPage"); const searchInput = document.getElementById("searchInput"); let movies = []; let filteredMovies = []; let currentPage = 1; const moviesPerPage = 10;

// Google Sheet CSV link
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
    const rows = data.split("\n").slice(1); // Skip headers
    movies = rows.map(row => {
        const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g); // Properly split by commas while keeping text inside quotes
        if (!columns || columns.length < 6) return null; // Ensure valid data
        return {
            title: columns[0].replace(/"/g, '').trim(),
            year: columns[1].replace(/"/g, '').trim(),
            poster: columns[2].replace(/"/g, '').trim(),
            stream: columns[3].replace(/"/g, '').trim(),
            download: columns[4].replace(/"/g, '').trim(),
            id: columns[5].replace(/"/g, '').trim()
        };
    }).filter(movie => movie); // Remove null values

    movies.reverse(); // Show latest movies first
    filteredMovies = [...movies];
    renderMovies();
}


function renderMovies() {
    movieList.innerHTML = "";
    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const paginatedMovies = filteredMovies.slice(start, end);

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
    nextPageBtn.disabled = end >= filteredMovies.length;
}

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

searchInput.addEventListener("input", () => {
    const searchQuery = searchInput.value.toLowerCase();
    filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchQuery));
    currentPage = 1;
    renderMovies();
});

fetchMovies();
});

