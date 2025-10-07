// Global variables
let allRecipes = [];
let displayedRecipes = [];
let currentLimit = 6;
const recipesPerPage = 6;
let searchTimeout = null;


// check auth
document.addEventListener('DOMContentLoaded', function() {
  const userName = localStorage.getItem('firstName');
  if (!userName) {
    window.location.href = '/login';
    return;
  }
  
  document.getElementById('userName').textContent = `Welcome, ${userName}!`;
  initEventListeners();
  fetchRecipes();
});


// Initialize
function initEventListeners() {
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  document.getElementById('cuisineFilter').addEventListener('change', applyFilters);
  document.getElementById('loadMoreBtn').addEventListener('click', loadMoreRecipes);
  document.querySelector('.close-btn').addEventListener('click', closeModal);
  
  document.getElementById('recipeModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
}

// Fetch recipes from API
async function fetchRecipes() {
  try {
    showLoading(true);
    const response = await fetch('https://dummyjson.com/recipes');
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const data = await response.json();
    allRecipes = data.recipes;
    

    populateCuisineFilter();
    

    displayedRecipes = [...allRecipes];
    displayRecipes();
    
    showLoading(false);
  } catch (error) {
    showLoading(false);
    const recipeGrid = document.getElementById('recipeGrid');
    recipeGrid.innerHTML = `<div class="error">Error loading recipes. Please try again later.</div>`;
    updateCountText(0, 0);
  }
}

function populateCuisineFilter() {
  const cuisineFilter = document.getElementById('cuisineFilter');
  const cuisines = [...new Set(allRecipes.map(recipe => recipe.cuisine))];
  
  cuisineFilter.innerHTML = '<option value="all">All Cuisines</option>';
  
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.value = cuisine.toLowerCase();
    option.textContent = cuisine;
    cuisineFilter.appendChild(option);
  });
}


function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(applyFilters, 300);
}

function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const cuisine = document.getElementById('cuisineFilter').value;

  displayedRecipes = allRecipes.filter(recipe => {    
    if (cuisine !== 'all' && recipe.cuisine.toLowerCase() !== cuisine) {
      return false;
    }
    
    // Filter by search term (name, cuisine, ingredients, tags)
    if (searchTerm) {
      const nameMatch = recipe.name.toLowerCase().includes(searchTerm);
      const cuisineMatch = recipe.cuisine.toLowerCase().includes(searchTerm);
      const ingredientMatch = recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      );
      const tagMatch = recipe.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm)
      );
      
      if (!nameMatch && !cuisineMatch && !ingredientMatch && !tagMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  currentLimit = recipesPerPage;
  displayRecipes();
}

function displayRecipes() {
  const recipeGrid = document.getElementById('recipeGrid');
  recipeGrid.innerHTML = '';
  
  const recipesToShow = displayedRecipes.slice(0, currentLimit);
  
  if (recipesToShow.length === 0) {
    recipeGrid.innerHTML = '<div class="no-results">No recipes found matching your criteria.</div>';
    document.getElementById('loadMoreBtn').style.display = 'none';
    updateCountText(0, displayedRecipes.length);
    return;
  }
  
  recipesToShow.forEach(recipe => {
    const recipeCard = createRecipeCard(recipe);
    recipeGrid.appendChild(recipeCard);
  });
  
  if (displayedRecipes.length > currentLimit) {
    document.getElementById('loadMoreBtn').style.display = 'block';
  } else {
    document.getElementById('loadMoreBtn').style.display = 'none';
  }
  
  updateCountText(recipesToShow.length, displayedRecipes.length);
}


function createRecipeCard(recipe) {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  
  const ratingStars = '★'.repeat(Math.round(recipe.rating)) + '☆'.repeat(5 - Math.round(recipe.rating));
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  
  card.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.name}" />
    <div class="recipe-info">
      <h3>${recipe.name}</h3>
      <div class="rating">${ratingStars} (${recipe.rating})</div>
      <p>⏱️ ${totalTime} mins • ${getDifficultyIcon(recipe.difficulty)} ${recipe.difficulty} • ${recipe.cuisine}</p>
      <p><b>Ingredients:</b> ${recipe.ingredients.slice(0, 3).join(', ')}${recipe.ingredients.length > 3 ? '...' : ''}</p>
      <button class="view-btn" data-id="${recipe.id}">View Full Recipe</button>
    </div>
  `;
  
  card.querySelector('.view-btn').addEventListener('click', function() {
    showRecipeDetails(recipe);
  });
  
  return card;
}

function showRecipeDetails(recipe) {
  const ratingStars = '★'.repeat(Math.round(recipe.rating)) + '☆'.repeat(5 - Math.round(recipe.rating));
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <div class="modal-header">
      <h2>${recipe.name}</h2>
    </div>

    <div class="modal-top">
      <div class="modal-image">
        <img src="${recipe.image}" alt="${recipe.name}" />
      </div>

      <div class="modal-meta-grid">
        <div class="modal-meta-item">
          <div class="modal-meta-label">PREP TIME</div>
          <div class="modal-meta-value">${recipe.prepTimeMinutes} mins</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-label">COOK TIME</div>
          <div class="modal-meta-value">${recipe.cookTimeMinutes} mins</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-label">TOTAL TIME</div>
          <div class="modal-meta-value">${totalTime} mins</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-label">SERVINGS</div>
          <div class="modal-meta-value">${recipe.servings}</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-label">DIFFICULTY</div>
          <div class="modal-meta-value">${recipe.difficulty}</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-label">CUISINE</div>
          <div class="modal-meta-value">${recipe.cuisine}</div>
        </div>
      </div>
    </div>

    <div class="modal-info">
      <div class="modal-rating">
        <span class="modal-stars">${ratingStars}</span>
        <span class="modal-rating-text">${recipe.rating} (${recipe.reviewCount} reviews)</span>
      </div>
      <div class="modal-nutrition">
        <h3>Nutrition Information</h3>
        <div class="nutrition-value">${recipe.caloriesPerServing} calories per serving</div>
      </div>
    </div>
    
    <div class="modal-section">
      <h3>Ingredients</h3>
      <ul class="modal-ingredients">
        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
    </div>
    
    <div class="modal-section">
      <h3>Instructions</h3>
      <ol class="modal-instructions">
        ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
      </ol>
    </div>
    
    ${recipe.tags && recipe.tags.length > 0 ? `
    <div class="modal-section">
      <h3>Tags</h3>
      <div class="modal-tags">
        ${recipe.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
      </div>
    </div>
    ` : ''}`;
  
  document.getElementById('recipeModal').style.display = 'block';
  document.body.classList.add("no-scroll");
}

function closeModal() {
  document.body.classList.remove("no-scroll")
  document.getElementById('recipeModal').style.display = 'none';
}

function loadMoreRecipes() {
  currentLimit += recipesPerPage;
  displayRecipes();
}

function updateCountText(shown, total) {
  document.getElementById('countText').textContent = `Showing ${shown} of ${total} recipes`;
}

function showLoading(show) {
  const recipeGrid = document.getElementById('recipeGrid');
  if (show) {
    recipeGrid.innerHTML = '<div class="loading">Loading recipes...</div>';
  }
}

function handleLogout() {
  localStorage.removeItem('firstName');
  window.location.href = '/login';
}

function getDifficultyIcon(difficulty) {
  switch(difficulty.toLowerCase()) {
    case 'easy': return '🟢';
    case 'medium': return '🟡';
    case 'hard': return '🔴';
    default: return '⚪';
  }
}

