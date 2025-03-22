// Google Sheets CSV URL
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0D7_9n5fJGj30Erv8CEr3rz7UGPh3qdvSx79RiVCf2iuT_yZw51mr-9cdGxpyXbSPTbYXcuHC8cPk/pub?output=csv";

// Function to create a movie card (for index.html)
function createMovieCard(title, year, poster, slug) {
    return `
        <a href="movie.html?movie=${slug}" class="movie-link">
            <div class="movie-card">
                <img src="${poster}" alt="${title} Poster">
                <h2>${title} (${year})</h2>
            </div>
        </a>
    `;
}

// Fetch data from Google Sheets
fetch(sheetUrl)
    .then(response => response.text())
    .then(data => {
        const rows = data.split("\n").slice(1); // Split rows and remove header
        const movieList = document.getElementById("movie-list");

        rows.forEach(row => {
            const [title, year, poster, streamLink, downloadLink, slug] = row.split(",");

            // Add movie card to the list
            movieList.innerHTML += createMovieCard(title, year, poster, slug);
        });
    })
    .catch(error => console.error("Error fetching movie data:", error));
