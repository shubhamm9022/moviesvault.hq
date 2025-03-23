// Google Sheets CSV URL
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0D7_9n5fJGj30Erv8CEr3rz7UGPh3qdvSx79RiVCf2iuT_yZw51mr-9cdGxpyXbSPTbYXcuHC8cPk/pub?output=csv";

// Get movie from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const movieParam = urlParams.get("movie");

// Fetch data from Google Sheets
fetch(sheetUrl)
    .then(response => response.text())
    .then(data => {
        const rows = data.split("\n").slice(1); // Split rows, ignore the first header row
        let movieFound = false;

        rows.forEach(row => {
            const [title, year, poster, streamLink, downloadLink] = row.split(",");

            if (movieParam && movieParam.toLowerCase() === title.toLowerCase().replace(/ /g, "-")) {
                document.getElementById("movie-poster").src = poster;
                document.getElementById("movie-title").innerText = `${title} (${year})`;
                document.getElementById("stream-link").href = streamLink;
                document.getElementById("download-link").href = downloadLink;

                movieFound = true;
            }
        });

        // Handle movie not found
        if (!movieFound) {
            document.getElementById("movie-title").innerText = "Movie Not Found!";
            document.getElementById("movie-title").classList.add("error");
            document.getElementById("stream-link").style.display = "none";
            document.getElementById("download-link").style.display = "none";
        }
    })
    .catch(error => console.error("Error loading movie data:", error));

// Function to generate sharable link
function generateShareLink(movieTitle) {
    const cleanTitle = movieTitle.toLowerCase().replace(/ /g, "-");
    const link = `${window.location.origin}${window.location.pathname}?movie=${cleanTitle}`;
    navigator.clipboard.writeText(link).then(() => alert("Link copied to clipboard!"));
}
