/**
 * FoodOrder - Restaurant Details View (Module B)
 * Restaurant cover, cuisine, rating, delivery info, categorized menu,
 * in-menu search, dietary filter, item customization modal, and customer reviews.
 */

import { store } from '../state/store.js';
import { FoodDetailModal } from '../components/FoodDetailModal.js';
import { Toast } from '../components/Toast.js';

export const RestaurantPage = {
  render(params = {}) {
    const restId = params.id || 'rest-1';
    const restaurant = store.getRestaurantById(restId);

    if (!restaurant) {
      return `
        <div class="container" style="padding: 4rem 1rem;">
          <div class="empty-state">
            <div class="empty-state-icon">🏪</div>
            <h3 class="empty-state-title">Restaurant Not Found</h3>
            <p class="empty-state-desc">The restaurant you are looking for does not exist or has been removed.</p>
            <a href="#restaurants" class="btn btn-primary">Browse All Restaurants &rarr;</a>
          </div>
        </div>
      `;
    }

    const allDishes = store.getFoodItems(restaurant.id);
    const reviews = store.getReviews(restaurant.id);

    // Extract unique categories for this restaurant
    const categories = ['All', ...new Set(allDishes.map(d => d.category))];

    return `
      <div class="restaurant-page container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Breadcrumbs">
          <a href="#home">Home</a>
          <span class="sep">/</span>
          <a href="#restaurants">Restaurants</a>
          <span class="sep">/</span>
          <span class="current">${restaurant.name}</span>
        </nav>

        <!-- Restaurant Banner -->
        <div class="restaurant-banner">
          <img src="${restaurant.coverImage}" alt="${restaurant.name} banner" onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'">
          <div class="restaurant-banner-overlay">
            <div class="restaurant-banner-info">
              <h1>${restaurant.name}</h1>
              <p style="font-size: 0.95rem; opacity: 0.9; margin-bottom: 8px;">${restaurant.tagline}</p>
              <div class="restaurant-banner-meta">
                <span class="rating-badge rating-amber" style="font-size: 0.85rem;">★ ${restaurant.rating} (${restaurant.reviewCount} reviews)</span>
                <span>⏱️ ${restaurant.deliveryTime}</span>
                <span>🚲 ${restaurant.deliveryFee === 0 ? 'Free Delivery' : `$${restaurant.deliveryFee.toFixed(2)} Fee`}</span>
                <span>🏷️ Min Order $${restaurant.minOrder.toFixed(2)}</span>
                <span>📍 ${restaurant.address}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Restaurant Description & Phone -->
        <div style="background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: 1.25rem; margin-bottom: 2rem;">
          <p style="font-size: 0.95rem; color: var(--color-text-body); line-height: 1.6; margin-bottom: 0.5rem;">
            ${restaurant.description}
          </p>
          <div style="display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--color-text-muted); flex-wrap: wrap;">
            <span><strong>Cuisines:</strong> ${restaurant.cuisines.join(', ')}</span>
            <span><strong>Call:</strong> ${restaurant.phone}</span>
            <span><strong>Price:</strong> ${restaurant.priceRange}</span>
          </div>
        </div>

        <!-- Menu Navigation & Search Toolbar -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <!-- Category Pills -->
          <div class="restaurant-nav-pills" id="restaurant-category-pills">
            ${categories.map((cat, idx) => `
              <button class="restaurant-nav-pill ${idx === 0 ? 'active' : ''}" data-cat="${cat}">
                ${cat}
              </button>
            `).join('')}
          </div>

          <!-- In-menu search & veg filter -->
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <div class="input-with-icon" style="width: 220px;">
              <span class="input-icon">🔍</span>
              <input type="text" id="menu-search-input" class="form-control" placeholder="Search menu..." style="padding-top: 6px; padding-bottom: 6px;">
            </div>
            <button class="btn btn-outline btn-sm" id="toggle-veg-filter-btn" style="white-space: nowrap;">
              🌱 Pure Veg Only
            </button>
          </div>
        </div>

        <!-- Menu Grid -->
        <div class="food-grid" id="restaurant-menu-grid">
          ${allDishes.map(food => this.renderMenuItem(food)).join('')}
        </div>

        <!-- Customer Reviews Section (Bonus Feature 2 & Module J) -->
        <section style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--color-border);">
          <div class="section-header">
            <div>
              <h2 class="section-title">Customer Reviews & Ratings</h2>
              <p class="section-subtitle">Real feedback from FoodOrder community diners</p>
            </div>
            <button class="btn btn-primary btn-sm" id="open-review-form-btn">
              ⭐ Write a Review
            </button>
          </div>

          <!-- Review Submission Form (Hidden initially or toggled) -->
          <div id="review-form-container" style="display: none; background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 2rem;">
            <h4 style="margin-bottom: 1rem; color: var(--color-text-main);">Share Your Dining Experience</h4>
            <form id="restaurant-review-form">
              <div class="form-group">
                <label class="form-label">Your Rating <span class="required">*</span></label>
                <div class="star-interactive" id="review-stars-group">
                  <button type="button" data-val="1">★</button>
                  <button type="button" data-val="2">★</button>
                  <button type="button" data-val="3">★</button>
                  <button type="button" data-val="4">★</button>
                  <button type="button" data-val="5" class="active">★</button>
                </div>
                <input type="hidden" id="review-rating-val" value="5">
              </div>

              <div class="form-group">
                <label class="form-label">Your Comments <span class="required">*</span></label>
                <textarea id="review-comment-val" class="form-control" rows="3" placeholder="Tell us about the flavors, temperature, and speed of delivery..." required></textarea>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                <button type="button" class="btn btn-ghost" id="cancel-review-btn">Cancel</button>
                <button type="submit" class="btn btn-primary">Submit Review</button>
              </div>
            </form>
          </div>

          <!-- Reviews List -->
          <div class="reviews-list" style="display: flex; flex-direction: column; gap: 1rem;">
            ${reviews.length === 0 ? `
              <p style="color: var(--color-text-muted); font-size: 0.9rem;">No reviews yet for this restaurant. Be the first to leave one!</p>
            ` : reviews.map(rev => `
              <div style="background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="user-avatar" style="width: 28px; height: 28px; font-size: 11px;">${rev.userAvatar || 'U'}</span>
                    <strong style="font-size: 0.9rem; color: var(--color-text-main);">${rev.userName}</strong>
                  </div>
                  <span style="font-size: 0.75rem; color: var(--color-text-muted);">${rev.date}</span>
                </div>
                <div style="color: var(--color-primary); font-size: 0.9rem; margin-bottom: 6px;">
                  ${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}
                </div>
                <p style="font-size: 0.85rem; color: var(--color-text-body); line-height: 1.5;">${rev.comment}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  },

  renderMenuItem(food) {
    const isAvailable = food.available !== false;

    return `
      <div class="food-card" data-food-id="${food.id}" data-category="${food.category}" data-is-veg="${food.isVeg}">
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

          <p class="food-desc">${food.description}</p>

          <div class="food-footer">
            <div class="food-price">$${Number(food.price).toFixed(2)}</div>
            <button type="button" class="btn btn-primary btn-sm rest-add-to-cart-btn" data-food-id="${food.id}" ${!isAvailable ? 'disabled' : ''}>
              ${isAvailable ? '+ Add' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents(params = {}) {
    const restId = params.id || 'rest-1';
    window.FoodOrderOpenModal = (id) => FoodDetailModal.open(id);

    let activeCategory = 'All';
    let filterVegOnly = false;
    let searchQuery = '';

    const filterMenu = () => {
      const cards = document.querySelectorAll('#restaurant-menu-grid .food-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const isVeg = card.getAttribute('data-is-veg') === 'true';
        const name = card.querySelector('.food-name')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.food-desc')?.textContent.toLowerCase() || '';

        const matchesCat = activeCategory === 'All' || cat === activeCategory;
        const matchesVeg = !filterVegOnly || isVeg;
        const matchesSearch = !searchQuery || name.includes(searchQuery) || desc.includes(searchQuery);

        if (matchesCat && matchesVeg && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
    };

    // Category pill filtering
    document.querySelectorAll('.restaurant-nav-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.restaurant-nav-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-cat');
        filterMenu();
      });
    });

    // In-menu search
    const searchInput = document.getElementById('menu-search-input');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterMenu();
    });

    // Veg-only toggle
    const vegBtn = document.getElementById('toggle-veg-filter-btn');
    vegBtn?.addEventListener('click', () => {
      filterVegOnly = !filterVegOnly;
      vegBtn.classList.toggle('btn-primary', filterVegOnly);
      vegBtn.classList.toggle('btn-outline', !filterVegOnly);
      filterMenu();
    });

    // Add to cart buttons
    document.querySelectorAll('.rest-add-to-cart-btn').forEach(btn => {
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

    // Reviews form toggle & submission
    const reviewFormContainer = document.getElementById('review-form-container');
    const openReviewBtn = document.getElementById('open-review-form-btn');
    const cancelReviewBtn = document.getElementById('cancel-review-btn');
    const reviewForm = document.getElementById('restaurant-review-form');

    openReviewBtn?.addEventListener('click', () => {
      const user = store.getCurrentUser();
      if (!user) {
        Toast.warning('Login Required', 'Please log in to submit a review.');
        window.location.hash = '#auth';
        return;
      }
      reviewFormContainer.style.display = 'block';
      reviewFormContainer.scrollIntoView({ behavior: 'smooth' });
    });

    cancelReviewBtn?.addEventListener('click', () => {
      reviewFormContainer.style.display = 'none';
    });

    // Star rating buttons
    const starBtns = document.querySelectorAll('#review-stars-group button');
    const ratingInput = document.getElementById('review-rating-val');

    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = Number(btn.getAttribute('data-val'));
        if (ratingInput) ratingInput.value = val;
        starBtns.forEach(b => {
          const bVal = Number(b.getAttribute('data-val'));
          if (bVal <= val) {
            b.style.color = 'var(--color-primary)';
          } else {
            b.style.color = 'var(--color-border)';
          }
        });
      });
    });

    reviewForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const rating = Number(ratingInput?.value || 5);
      const comment = document.getElementById('review-comment-val')?.value || '';

      const res = store.addReview({
        restaurantId: restId,
        rating,
        comment
      });

      if (res.success) {
        Toast.success('Review Submitted! ⭐', 'Thank you for your rating.');
        if (typeof window.FoodOrderRefresh === 'function') {
          window.FoodOrderRefresh();
        } else {
          window.location.reload();
        }
      } else {
        Toast.error('Review Error', res.message);
      }
    });
  }
};
