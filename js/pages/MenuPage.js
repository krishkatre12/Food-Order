/**
 * FoodOrder - Universal Menu Browsing View (Module C)
 * Filter by all 7 food categories, search by food & restaurant name,
 * sort by price/rating/time, dietary toggle, and add items to cart.
 */

import { store } from '../state/store.js';
import { FoodDetailModal } from '../components/FoodDetailModal.js';
import { Toast } from '../components/Toast.js';

export const MenuPage = {
  render(params = {}) {
    const categories = store.getCategories();
    const allDishes = store.getFoodItems();
    const restaurants = store.getRestaurants();

    const selectedCategory = params.category || 'All';

    return `
      <div class="menu-page container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Breadcrumbs">
          <a href="#home">Home</a>
          <span class="sep">/</span>
          <span class="current">Menu Browsing</span>
        </nav>

        <!-- Page Header -->
        <div class="section-header" style="margin-bottom: 1.5rem;">
          <div>
            <h1 class="section-title" style="font-size: 2rem;">Explore Full Menu 🍽️</h1>
            <p class="section-subtitle">Discover handcrafted dishes across ${restaurants.length} premier local restaurants</p>
          </div>
        </div>

        <!-- Filter & Search Controls Bar -->
        <div style="
          background-color: var(--color-bg-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-2xl);
          padding: 1.25rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        ">
          <!-- Top Row: Search & Sort Controls -->
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: space-between;">
            <!-- Search Input -->
            <div class="input-with-icon" style="flex: 1; min-width: 260px;">
              <span class="input-icon">🔍</span>
              <input type="text" id="universal-search-input" class="form-control" placeholder="Search by dish name or restaurant...">
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
              <!-- Dietary Toggle -->
              <div style="display: flex; background: var(--color-bg-subtle); border-radius: var(--radius-lg); padding: 3px; border: 1px solid var(--color-border);">
                <button type="button" class="diet-filter-btn btn-sm btn-ghost active" data-diet="all" style="padding: 4px 10px; border-radius: var(--radius-md);">All</button>
                <button type="button" class="diet-filter-btn btn-sm btn-ghost" data-diet="veg" style="padding: 4px 10px; border-radius: var(--radius-md);">🌱 Veg</button>
                <button type="button" class="diet-filter-btn btn-sm btn-ghost" data-diet="non-veg" style="padding: 4px 10px; border-radius: var(--radius-md);">🍗 Non-Veg</button>
              </div>

              <!-- Sort Dropdown -->
              <select id="sort-select" class="form-control" style="width: auto; padding: 6px 14px; font-weight: 600;">
                <option value="popularity">Sort: Most Popular</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>

          <!-- Category Filter Pills (7 Required Categories) -->
          <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;" id="menu-cat-pills">
            <button class="restaurant-nav-pill ${selectedCategory === 'All' ? 'active' : ''}" data-cat="All">
              🍽️ All Items (${allDishes.length})
            </button>
            ${categories.map(cat => {
              const count = allDishes.filter(d => d.category === cat.name).length;
              return `
                <button class="restaurant-nav-pill ${selectedCategory === cat.name ? 'active' : ''}" data-cat="${cat.name}">
                  ${cat.icon} ${cat.name} (${count})
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Food Items Grid -->
        <div class="food-grid" id="universal-food-grid">
          ${allDishes.map(food => this.renderFoodCard(food)).join('')}
        </div>

        <!-- Empty Results Placeholder -->
        <div id="no-food-results" class="empty-state" style="display: none;">
          <div class="empty-state-icon">🍲</div>
          <h4 class="empty-state-title">No dishes match your filter</h4>
          <p class="empty-state-desc">Try resetting your search query or choosing another food category.</p>
          <button class="btn btn-primary" id="reset-menu-filters-btn" style="margin-top: 1rem;">Reset Filters</button>
        </div>
      </div>
    `;
  },

  renderFoodCard(food) {
    const isAvailable = food.available !== false;

    return `
      <div class="food-card" data-food-id="${food.id}" data-category="${food.category}" data-diet="${food.isVeg ? 'veg' : 'non-veg'}" data-price="${food.price}" data-rating="${food.rating}" data-name="${food.name.toLowerCase()}" data-restaurant="${food.restaurantName.toLowerCase()}">
        <div class="food-img-wrap" onclick="window.FoodOrderOpenModal('${food.id}')" style="cursor: pointer;">
          <img src="${food.image}" alt="${food.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
          <div class="food-badges">
            <span class="diet-indicator ${food.isVeg ? 'veg' : 'non-veg'}" title="${food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
            ${food.isChefSpecial ? '<span class="badge badge-warning">Chef Special</span>' : ''}
            ${food.isSpicy ? '<span class="badge badge-danger">Spicy</span>' : ''}
            ${!isAvailable ? '<span class="badge badge-danger">Unavailable</span>' : ''}
          </div>
        </div>

        <div class="food-content">
          <div class="food-title-row">
            <h4 class="food-name" onclick="window.FoodOrderOpenModal('${food.id}')" style="cursor: pointer;">${food.name}</h4>
            <span class="rating-badge" style="font-size: 11px;">★ ${food.rating}</span>
          </div>

          <a href="#restaurant/${food.restaurantId}" class="food-restaurant">
            🏪 ${food.restaurantName}
          </a>

          <p class="food-desc">${food.description}</p>

          <div class="food-footer">
            <div class="food-price">$${Number(food.price).toFixed(2)}</div>
            <button type="button" class="btn btn-primary btn-sm universal-add-btn" data-food-id="${food.id}" ${!isAvailable ? 'disabled' : ''}>
              ${isAvailable ? '+ Add' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents(params = {}) {
    window.FoodOrderOpenModal = (id) => FoodDetailModal.open(id);

    let activeCategory = params.category || 'All';
    let activeDiet = 'all';
    let searchQuery = '';
    let sortMode = 'popularity';

    const grid = document.getElementById('universal-food-grid');
    const noResults = document.getElementById('no-food-results');

    const applyFiltersAndSort = () => {
      const cards = Array.from(grid.querySelectorAll('.food-card'));
      let visibleCards = [];

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const diet = card.getAttribute('data-diet');
        const name = card.getAttribute('data-name');
        const rest = card.getAttribute('data-restaurant');

        const matchesCat = activeCategory === 'All' || cat === activeCategory;
        const matchesDiet = activeDiet === 'all' || diet === activeDiet;
        const matchesSearch = !searchQuery || name.includes(searchQuery) || rest.includes(searchQuery);

        if (matchesCat && matchesDiet && matchesSearch) {
          card.style.display = 'flex';
          visibleCards.push(card);
        } else {
          card.style.display = 'none';
        }
      });

      // Sort visible cards
      visibleCards.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price'));
        const priceB = parseFloat(b.getAttribute('data-price'));
        const ratingA = parseFloat(a.getAttribute('data-rating'));
        const ratingB = parseFloat(b.getAttribute('data-rating'));

        if (sortMode === 'price-asc') return priceA - priceB;
        if (sortMode === 'price-desc') return priceB - priceA;
        if (sortMode === 'rating') return ratingB - ratingA;
        return ratingB - ratingA; // default popularity/rating
      });

      // Re-append in sorted order
      visibleCards.forEach(card => grid.appendChild(card));

      if (visibleCards.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'flex';
      } else {
        grid.style.display = 'grid';
        noResults.style.display = 'none';
      }
    };

    // Category pills click
    document.querySelectorAll('#menu-cat-pills button').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#menu-cat-pills button').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-cat');
        applyFiltersAndSort();
      });
    });

    // Diet filter buttons
    document.querySelectorAll('.diet-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diet-filter-btn').forEach(b => {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-ghost');
        });
        btn.classList.add('active', 'btn-primary');
        btn.classList.remove('btn-ghost');
        activeDiet = btn.getAttribute('data-diet');
        applyFiltersAndSort();
      });
    });

    // Search input
    const searchInput = document.getElementById('universal-search-input');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFiltersAndSort();
    });

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    sortSelect?.addEventListener('change', (e) => {
      sortMode = e.target.value;
      applyFiltersAndSort();
    });

    // Reset filters button
    document.getElementById('reset-menu-filters-btn')?.addEventListener('click', () => {
      activeCategory = 'All';
      activeDiet = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('#menu-cat-pills button').forEach((p, idx) => {
        p.classList.toggle('active', idx === 0);
      });
      document.querySelectorAll('.diet-filter-btn').forEach((b, idx) => {
        b.classList.toggle('active', idx === 0);
        b.classList.toggle('btn-primary', idx === 0);
        b.classList.toggle('btn-ghost', idx !== 0);
      });
      applyFiltersAndSort();
    });

    // Add button handler
    grid?.querySelectorAll('.universal-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const foodId = btn.getAttribute('data-food-id');
        const food = store.getFoodItemById(foodId);
        if (!food) return;

        if (food.customizations && food.customizations.some(c => c.required)) {
          FoodDetailModal.open(foodId);
          return;
        }

        const res = store.addToCart(food, 1, [], false);
        if (res.conflict) {
          FoodDetailModal.open(foodId);
        } else {
          Toast.success('Added to Cart! 🛒', `1x ${food.name} added.`);
        }
      });
    });

    // Initial filter run if category param was supplied
    if (params.category) {
      applyFiltersAndSort();
    }
  }
};

