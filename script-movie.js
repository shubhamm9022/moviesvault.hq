// Google Sheets CSV URL
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0D7_9n5fJGj30Erv8CEr3rz7UGPh3qdvSx79RiVCf2iuT_yZw51mr-9cdGxpyXbSPTbYXcuHC8cPk/pub?output=csv";

// Function to create a single movie card (for movie.html)
function createSingleMovieCard(title, year, poster, streamLink, downloadLink) {
    return `
        <div class="movie-card">
            <img src="${poster}" alt="${title} Poster">
            <h2>${title} (${year})</h2>
            <div class="buttons">
                <a href="${streamLink}" class="btn stream" target="_blank">Stream</a>
                <a href="${downloadLink}" class="btn download" target="_blank">Download</a>
            </div>
        </div>
    `;
}

// Fetch data from Google Sheets
fetch(sheetUrl)
    .then(response => response.text())
    .then(data => {
        const rows = data.split("\n").slice(1); // Split rows and remove header

        // Get the movie slug from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const movieSlug = urlParams.get('movie');

        const movieCard = document.getElementById("movie-card");

        rows.forEach(row => {
            const [title, year, poster, streamLink, downloadLink, slug] = row.split(",");

            if (slug === movieSlug) {
                // Display the single movie
                movieCard.innerHTML = createSingleMovieCard(title, year, poster, streamLink, downloadLink);
            }
        });
    })
    .catch(error => console.error("Error fetching movie data:", error));
