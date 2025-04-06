// 👉 Initialize Supabase
const supabaseUrl = 'https://ordokuezdipglyivqwus.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZG9rdWV6ZGlwZ2x5aXZxd3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzAzMzcsImV4cCI6MjA1OTQ0NjMzN30.cEQ5G4b83Hd-lnfBKm6wLPZwa2mwpVY78tqFBuWdvjY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 👉 Protect Assets
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key.toUpperCase()))) {
    e.preventDefault();
  }
});

// 👉 DOM Elements
const movieContainer = document.getElementById('movie-container');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const paginationContainer = document.getElementById('pagination');

let movies = [];
let filteredMovies = [];
let currentPage = 1;
const itemsPerPage = 10;

// 👉 Fetch Movies from Supabase
async function fetchMovies() {
  const { data, error } = await supabase
    .from('movie_details')
    .select('*')
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching movies:', error);
    return;
  }

  movies = data;
  filteredMovies = data;
  renderMovies();
  renderPagination();
}

// 👉 Render Movies on Page
function renderMovies() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentMovies = filteredMovies.slice(start, end);

  movieContainer.innerHTML = currentMovies.map(movie => `
    <div class="movie-card animate-fade-in">
      <img src="${movie.poster_url}" alt="${movie.title}" class="poster" oncontextmenu="return false;" draggable="false" />
      <h3>${movie.title} (${movie.year})</h3>
      <p>${movie.genre}</p>
      <a href="movie.html?slug=${movie.slug}" class="details-btn">View Details</a>
    </div>
  `).join('');
}

// 👉 Search Function
searchInput.addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderMovies();
  renderPagination();
});

// 👉 Filter by Category
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;

    if (category === 'all') {
      filteredMovies = movies;
    } else {
      filteredMovies = movies.filter(movie => movie.genre.toLowerCase().includes(category.toLowerCase()));
    }

    currentPage = 1;
    renderMovies();
    renderPagination();
  });
});

// 👉 Pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderMovies();
      renderPagination();
    });
    paginationContainer.appendChild(btn);
  }
}

// 👉 Fade-in Animation (CSS will be added below)
const style = document.createElement('style');
style.innerHTML = `
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  @keyframes fadeIn {
    from {opacity: 0; transform: translateY(10px);}
    to {opacity: 1; transform: translateY(0);}
  }

  .page-btn {
    margin: 0 5px;
    padding: 5px 10px;
    background: #111;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 6px;
  }

  .page-btn.active {
    background: #e50914;
    font-weight: bold;
  }
`;
document.head.appendChild(style);

// 👉 Initial Load
fetchMovies();
