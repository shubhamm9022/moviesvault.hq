// Initialize Supabase
const supabaseUrl = 'https://ordokuzipdgijvuvus.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZG9rdWV6ZGlwZ2x5aXZxd3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzAzMzcsImV4cCI6MjA1OTQ0NjMzN30.cEQ5G4b83Hd-lnfBKm6wLPZwa2mwpVY78tqFBuWdvjY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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

// Fetch Movies from Supabase
async function fetchMovies() {
  try {
    const { data, error } = await supabase
      .from('movie_details')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;

    movies = data;
    filteredMovies = data;
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
      <img src="${movie.poster_url}" alt="${movie.title}" class="poster" onerror="this.src='placeholder.jpg'" oncontextmenu="return false;" draggable="false" />
      <h3>${movie.title} (${movie.year})</h3>
      <p>${movie.genre}</p>
      <a href="movie.html?id=${movie.id}" class="details-btn">View Details</a>
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

  // Previous Button
  prevPageBtn.disabled = currentPage === 1;
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderMovies();
      renderPagination();
    }
  });

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderMovies();
      renderPagination();
    });
    paginationContainer.insertBefore(btn, nextPageBtn);
  }

  // Next Button
  nextPageBtn.disabled = currentPage === totalPages;
  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderMovies();
      renderPagination();
    }
  });
}

// Initial Load
fetchMovies();
