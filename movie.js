document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");

    if (!movieId) {
        document.getElementById("movie-details").innerHTML = "<p>Movie not found.</p>";
        return;
    }

    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0D7_9n5fJGj30Erv8CEr3rz7UGPh3qdvSx79RiVCf2iuT_yZw51mr-9cdGxpyXbSPTbYXcuHC8cPk/pub?output=csv";

    fetch(sheetURL)
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n").slice(1);
            const movies = rows.map(row => {
                const [title, year, poster, stream, download, id] = row.split(",");
                return { title, year, poster, stream, download, id: id?.trim() };
            });

            const movie = movies.find(m => m.id === movieId);

            if (movie) {
                document.getElementById("movie-title").textContent = movie.title;
                document.getElementById("movie-poster").src = movie.poster;
                document.getElementById("movie-year").textContent = movie.year;
                document.getElementById("stream-link").href = movie.stream;
                document.getElementById("download-link").href = movie.download;
            } else {
                document.getElementById("movie-details").innerHTML = "<p>Movie not found.</p>";
            }
        })
        .catch(error => console.error("Error fetching movie data:", error));
});
