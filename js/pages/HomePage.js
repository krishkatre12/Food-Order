/**
 * FoodOrder - Homepage View (Module A)
 * Hero with food imagery, interactive search bar, 7 category cards,
 * featured restaurants, popular dishes, and quick add-to-cart actions.
 */

import { store } from '../state/store.js';
import { FoodDetailModal } from '../components/FoodDetailModal.js';
import { Toast } from '../components/Toast.js';

export const HomePage = {
  render() {
    const categories = store.getCategories();
    const restaurants = store.getRestaurants();
    const foodItems = store.getFoodItems();

    const featuredRestaurants = restaurants.filter(r => r.featured);
    const popularDishes = foodItems.filter(f => f.isChefSpecial || f.rating >= 4.8).slice(0, 6);

    return `
      <div class="homepage">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="container hero-grid">
            <div class="hero-content">
              <div class="hero-badge">
                <span>🔥 Fast 30-min Delivery in Your City</span>
              </div>
              <h1 class="hero-title">
                Craving Delicious Food? <br>
                Delivered <span class="highlight">Hot & Fresh.</span>
              </h1>
              <p class="hero-subtitle">
                Order handcrafted artisan pizzas, gourmet burgers, fresh sushi, and wholesome bowls from the finest local kitchens.
              </p>

              <!-- Search Bar -->
              <div class="hero-search-box">
                <span style="font-size: 1.25rem; margin-left: 8px;">🔍</span>
                <input type="text" id="home-search-input" placeholder="Search pizza, burgers, sushi, or restaurants..." aria-label="Search food or restaurants">
                <button type="button" class="btn btn-primary" id="home-search-btn">
                  Search
                </button>
              </div>

              <!-- Stats Banner -->
              <div class="hero-stats">
                <div class="hero-stat-item">
                  <span class="hero-stat-number">50+</span>
                  <span class="hero-stat-label">Curated Dishes</span>
                </div>
                <div class="hero-stat-item">
                  <span class="hero-stat-number">25 min</span>
                  <span class="hero-stat-label">Avg. Delivery Time</span>
                </div>
                <div class="hero-stat-item">
                  <span class="hero-stat-number">4.8 ★</span>
                  <span class="hero-stat-label">Customer Satisfaction</span>
                </div>
              </div>
            </div>

            <!-- Hero Graphic Platter -->
            <div class="hero-visual">
              <div class="hero-image-wrapper">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" alt="Delicious appetizing food platter" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'">
                <!-- Floating badges -->
                <div class="hero-float-card hero-float-1">
                  <span style="font-size: 1.5rem;">🍕</span>
                  <div>
                    <strong style="font-size: 0.85rem; display: block; color: var(--color-text-main);">Wood-Fired Pizza</strong>
                    <span style="font-size: 0.75rem; color: var(--color-accent-green); font-weight: 700;">Free Delivery</span>
                  </div>
                </div>
                <div class="hero-float-card hero-float-2">
                  <span style="font-size: 1.5rem;">⭐</span>
                  <div>
                    <strong style="font-size: 0.85rem; display: block; color: var(--color-text-main);">4.9 Rating</strong>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">2,400+ Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Search Results Container (Dynamically toggled if user searches) -->
        <section class="container" id="home-search-results-section" style="display: none; margin-bottom: var(--space-12);">
          <div class="section-header">
            <div>
              <h2 class="section-title">
                <span>Search Results for "<span id="home-search-query-text"></span>"</span>
              </h2>
              <p class="section-subtitle">Showing matching restaurants and dishes</p>
            </div>
            <button class="btn btn-outline btn-sm" id="home-clear-search-btn">
              &times; Clear Search
            </button>
          </div>
          <div id="home-search-results-grid"></div>
        </section>

        <!-- Category Cards Section (7 Required Categories) -->
        <section class="container" style="margin-bottom: var(--space-12);">
          <div class="section-header">
            <div>
              <h2 class="section-title">
                <span>Explore By Category</span>
              </h2>
              <p class="section-subtitle">Find your favorite culinary cravings in one tap</p>
            </div>
            <a href="#menu" class="view-all-link">Browse Full Menu &rarr;</a>
          </div>

          <div class="categories-container" id="home-categories-list">
            ${categories.map(cat => `
              <div class="category-card" data-category="${cat.name}">
                <div class="category-icon-wrapper">${cat.icon}</div>
                <span class="category-name">${cat.name}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Featured Restaurants Section -->
        <section class="container" style="margin-bottom: var(--space-12);">
          <div class="section-header">
            <div>
              <h2 class="section-title">
                <span>Featured Restaurants</span>
                <span class="badge badge-primary">Top Rated</span>
              </h2>
              <p class="section-subtitle">Handpicked neighborhood favorites delivering to your door</p>
            </div>
            <a href="#restaurants" class="view-all-link">All Restaurants (${restaurants.length}) &rarr;</a>
          </div>

          <div class="restaurants-grid">
            ${featuredRestaurants.map(r => this.renderRestaurantCard(r)).join('')}
          </div>
        </section>

        <!-- Popular Dishes / Recommended Items -->
        <section class="container" style="margin-bottom: var(--space-12);">
          <div class="section-header">
            <div>
              <h2 class="section-title">
                <span>Popular Dishes 🔥</span>
                <span class="badge badge-secondary">Chef Specials</span>
              </h2>
              <p class="section-subtitle">Most ordered and highest-rated culinary delights this week</p>
            </div>
            <a href="#menu" class="view-all-link">View All Dishes &rarr;</a>
          </div>

          <div class="food-grid">
            ${popularDishes.map(food => this.renderFoodCard(food)).join('')}
          </div>
        </section>

        <!-- Promo Banner -->
        <section class="container" style="margin-bottom: var(--space-12);">
          <div style="
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            border-radius: var(--radius-2xl);
            padding: var(--space-8);
            color: #1F2937;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: var(--space-4);
            box-shadow: var(--shadow-lg);
          ">
            <div>
              <span class="badge" style="background: rgba(0,0,0,0.15); color: #FFF; margin-bottom: 8px;">LIMITED OFFER</span>
              <h3 style="font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 800; color: #FFF; margin-bottom: 4px;">
                Get 20% OFF Your Feast!
              </h3>
              <p style="color: #FEF3C7; font-size: 0.95rem;">
                Use promotional code <strong>FOODIE20</strong> during simulated checkout.
              </p>
            </div>
            <a href="#menu" class="btn btn-secondary btn-lg" style="background-color: #064E3B; color: #FFF;">
              Order Now &rarr;
            </a>
          </div>
        </section>
      </div>
    `;
  },

  renderRestaurantCard(r) {
    return `
      <div class="restaurant-card" data-restaurant-id="${r.id}" onclick="window.location.hash='#restaurant/${r.id}'">
        <div class="rest-image-wrap">
          <img src="${r.image}" alt="${r.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'">
          <div class="rest-badge-top">
            ${r.deliveryFee === 0 ? '<span class="badge badge-success">Free Delivery</span>' : ''}
          </div>
          <div class="rest-time-badge">
            ⏱️ ${r.deliveryTime}
          </div>
        </div>

        <div class="rest-content">
          <div class="rest-header">
            <h3 class="rest-title">${r.name}</h3>
            <span class="rating-badge rating-amber">
              ★ ${r.rating}
            </span>
          </div>

          <p class="rest-cuisines">${r.cuisines.join(' • ')}</p>

          <div class="rest-meta">
            <span class="rest-meta-item">
              🚲 ${r.deliveryFee === 0 ? 'Free' : `$${r.deliveryFee.toFixed(2)} Fee`}
            </span>
            <span class="rest-meta-item">
              🏷️ Min $${r.minOrder.toFixed(2)}
            </span>
            <span class="rest-meta-item">
              ${r.priceRange}
            </span>
          </div>
        </div>
      </div>
    `;
  },

  renderFoodCard(food) {
    const isAvailable = food.available !== false;

    return `
      <div class="food-card" data-food-id="${food.id}">
        <div class="food-img-wrap" onclick="window.FoodOrderOpenModal('${food.id}')" style="cursor: pointer;">
          <img src="${food.image}" alt="${food.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
          <div class="food-badges">
            <span class="diet-indicator ${food.isVeg ? 'veg' : 'non-veg'}" title="${food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
            ${food.isChefSpecial ? '<span class="badge badge-warning">Chef Pick</span>' : ''}
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
            <button type="button" class="btn btn-primary btn-sm add-to-cart-quick-btn" data-food-id="${food.id}" ${!isAvailable ? 'disabled' : ''}>
              ${isAvailable ? '+ Add' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Quick modal helper for onclick string
    window.FoodOrderOpenModal = (id) => FoodDetailModal.open(id);

    // Category click handler
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        window.location.hash = `#menu?category=${encodeURIComponent(cat)}`;
      });
    });

    // Add to cart quick button
    document.querySelectorAll('.add-to-cart-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const foodId = btn.getAttribute('data-food-id');
        const food = store.getFoodItemById(foodId);
        if (!food) return;

        // If dish has required customizations, open detail modal
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

    // Search bar functionality
    const searchInput = document.getElementById('home-search-input');
    const searchBtn = document.getElementById('home-search-btn');
    const clearBtn = document.getElementById('home-clear-search-btn');

    const handleSearch = () => {
      const q = (searchInput?.value || '').trim().toLowerCase();
      if (!q) {
        this.clearSearch();
        return;
      }
      this.performSearch(q);
    };

    searchBtn?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });

    clearBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      this.clearSearch();
    });
  },

  performSearch(query) {
    const resultsSec = document.getElementById('home-search-results-section');
    const querySpan = document.getElementById('home-search-query-text');
    const resultsGrid = document.getElementById('home-search-results-grid');

    if (!resultsSec || !querySpan || !resultsGrid) return;

    querySpan.textContent = query;
    resultsSec.style.display = 'block';

    const restaurants = store.getRestaurants().filter(r => 
      r.name.toLowerCase().includes(query) ||
      r.cuisines.some(c => c.toLowerCase().includes(query)) ||
      r.description.toLowerCase().includes(query)
    );

    const dishes = store.getFoodItems().filter(f => 
      f.name.toLowerCase().includes(query) ||
      f.category.toLowerCase().includes(query) ||
      f.restaurantName.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query)
    );

    if (restaurants.length === 0 && dishes.length === 0) {
      resultsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h4 class="empty-state-title">No matching food or restaurants found</h4>
          <p class="empty-state-desc">We couldn't find anything matching "${query}". Try searching for pizza, burgers, sushi, or noodles.</p>
        </div>
      `;
      resultsSec.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    let html = '';

    if (restaurants.length > 0) {
      html += `
        <h3 style="font-size: 1.15rem; font-weight: 700; margin: 1rem 0; color: var(--color-text-main);">
          Matching Restaurants (${restaurants.length})
        </h3>
        <div class="restaurants-grid" style="margin-bottom: 2rem;">
          ${restaurants.map(r => this.renderRestaurantCard(r)).join('')}
        </div>
      `;
    }

    if (dishes.length > 0) {
      html += `
        <h3 style="font-size: 1.15rem; font-weight: 700; margin: 1rem 0; color: var(--color-text-main);">
          Matching Dishes (${dishes.length})
        </h3>
        <div class="food-grid">
          ${dishes.map(d => this.renderFoodCard(d)).join('')}
        </div>
      `;
    }

    resultsGrid.innerHTML = html;
    this.attachEvents();
    resultsSec.scrollIntoView({ behavior: 'smooth' });
  },

  clearSearch() {
    const resultsSec = document.getElementById('home-search-results-section');
    if (resultsSec) resultsSec.style.display = 'none';
  }
};

