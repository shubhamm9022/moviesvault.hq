// Protect Assets
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key.toUpperCase()))) {
    e.preventDefault();
  }
});

// DOM Elements
const movieContainer = document.getElementById('movie-container');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryButtons = document.querySelectorAll('.category-btn');
const paginationContainer = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');

let movies = [];
let filteredMovies = [];
let currentPage = 1;
const itemsPerPage = 10;

// Fetch Movies from Google Sheets
async function fetchMovies() {
  try {
    const response = await fetch("https://opensheet.elk.sh/1oDtwyGB7ArzmWtP81I2QeBNXAiEefgTOepAHqwRfNZs/Sheet1");
    const data = await response.json();

    movies = data.reverse(); // Newest first
    filteredMovies = movies;
    renderMovies();
    renderPagination();
  } catch (error) {
    console.error('Error fetching movies:', error);
    movieContainer.innerHTML = '<p>Error loading movies. Please try again later.</p>';
  }
}

// Render Movies on Page
function renderMovies() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentMovies = filteredMovies.slice(start, end);

  movieContainer.innerHTML = currentMovies.map(movie => `
    <div class="movie-card animate-fade-in">
      <a href="movie.html?id=${movie.id}">
        <img src="${movie.poster_url}" alt="${movie.title}" class="poster" onerror="this.src='placeholder.jpg'" oncontextmenu="return false;" draggable="false" />
        <h3>${movie.title} (${movie.year})</h3>
      </a>
    </div>
  `).join('');
}

// Search Function
function handleSearch() {
  const query = searchInput.value.toLowerCase();
  filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderMovies();
  renderPagination();
}

searchInput.addEventListener('input', handleSearch);
searchBtn.addEventListener('click', handleSearch);

// Filter by Category
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;
    if (category === 'all') {
      filteredMovies = movies;
    } else {
      filteredMovies = movies.filter(movie => 
        movie.genre.toLowerCase().includes(category.toLowerCase())
      );
    }

    currentPage = 1;
    renderMovies();
    renderPagination();
  });
});

// Pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  prevPageBtn.disabled = currentPage === 1;
  prevPageBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderMovies();
      renderPagination();
    }
  };

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.onclick = () => {
      currentPage = i;
      renderMovies();
      renderPagination();
    };
    paginationContainer.insertBefore(btn, nextPageBtn);
  }

  nextPageBtn.disabled = currentPage === totalPages;
  nextPageBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderMovies();
      renderPagination();
    }
  };
}

// Initial Load
fetchMovies();

