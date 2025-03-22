// Google Sheets CSV URL
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0D7_9n5fJGj30Erv8CEr3rz7UGPh3qdvSx79RiVCf2iuT_yZw51mr-9cdGxpyXbSPTbYXcuHC8cPk/pub?output=csv";

// Fetch data from Google Sheets
fetch(sheetUrl)
    .then(response => response.text())
    .then(data => {
        const rows = data.split("\n").slice(1); // Split rows, ignore the first header row
        const movieList = document.getElementById("movie-list");

        rows.forEach(row => {
            const [title, year, poster, streamLink, downloadLink] = row.split(",");
            const movieItem = document.createElement("a");
            movieItem.href = `movie.html?title=${encodeURIComponent(title)}&year=${year}&poster=${encodeURIComponent(poster)}&stream=${encodeURIComponent(streamLink)}&download=${encodeURIComponent(downloadLink)}`;
            movieItem.className = "movie-item";
            movieItem.innerHTML = `
                <img src="${poster}" alt="${title} Poster">
                <h2>${title} (${year})</h2>
            `;
            movieList.appendChild(movieItem);
        });
    })
    .catch(error => console.error("Error loading movie data:", error));

// If on movie.html, extract query parameters and display details
const params = new URLSearchParams(window.location.search);
if (params.has("title")) {
    document.getElementById("movie-poster").src = params.get("poster");
    document.getElementById("movie-title").innerText = `${params.get("title")} (${params.get("year")})`;
    document.getElementById("stream-link").href = params.get("stream");
    document.getElementById("download-link").href = params.get("download");
}
