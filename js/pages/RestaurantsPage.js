/**
 * FoodOrder - Restaurants Directory View
 * Search and browse all 8+ partner restaurants with cuisine filters,
 * delivery fee tags, ratings, and minimum order information.
 */

import { store } from '../state/store.js';

export const RestaurantsPage = {
  render() {
    const restaurants = store.getRestaurants();

    return `
      <div class="restaurants-page container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Breadcrumbs">
          <a href="#home">Home</a>
          <span class="sep">/</span>
          <span class="current">Partner Restaurants</span>
        </nav>

        <!-- Header -->
        <div class="section-header">
          <div>
            <h1 class="section-title">Partner Restaurants 🏪</h1>
            <p class="section-subtitle">Browse ${restaurants.length} certified gourmet restaurants delivering across the city</p>
          </div>
        </div>

        <!-- Filter Bar -->
        <div style="
          background-color: var(--color-bg-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: 1rem;
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
        ">
          <div class="input-with-icon" style="flex: 1; min-width: 260px;">
            <span class="input-icon">🔍</span>
            <input type="text" id="rest-dir-search" class="form-control" placeholder="Search restaurant name or cuisine...">
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm rest-filter-btn active" data-filter="all">All</button>
            <button class="btn btn-outline btn-sm rest-filter-btn" data-filter="free-del">Free Delivery</button>
            <button class="btn btn-outline btn-sm rest-filter-btn" data-filter="top-rated">★ 4.8+ Rated</button>
          </div>
        </div>

        <!-- Grid -->
        <div class="restaurants-grid" id="restaurants-directory-grid">
          ${restaurants.map(r => this.renderCard(r)).join('')}
        </div>

        <div id="rest-no-results" class="empty-state" style="display: none;">
          <div class="empty-state-icon">🏪</div>
          <h4 class="empty-state-title">No restaurants found</h4>
          <p class="empty-state-desc">Try clearing your search query or reset filters.</p>
        </div>
      </div>
    `;
  },

  renderCard(r) {
    return `
      <div class="restaurant-card" data-id="${r.id}" data-name="${r.name.toLowerCase()}" data-cuisines="${r.cuisines.join(' ').toLowerCase()}" data-fee="${r.deliveryFee}" data-rating="${r.rating}" onclick="window.location.hash='#restaurant/${r.id}'">
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

          <p style="font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.4; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${r.description}
          </p>

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

  attachEvents() {
    const searchInput = document.getElementById('rest-dir-search');
    const filterBtns = document.querySelectorAll('.rest-filter-btn');
    const cards = Array.from(document.querySelectorAll('#restaurants-directory-grid .restaurant-card'));
    const noResults = document.getElementById('rest-no-results');

    let currentFilter = 'all';
    let searchQuery = '';

    const applyFilter = () => {
      let visible = 0;
      cards.forEach(card => {
        const name = card.getAttribute('data-name');
        const cuisines = card.getAttribute('data-cuisines');
        const fee = parseFloat(card.getAttribute('data-fee'));
        const rating = parseFloat(card.getAttribute('data-rating'));

        const matchesSearch = !searchQuery || name.includes(searchQuery) || cuisines.includes(searchQuery);
        let matchesFilter = true;
        if (currentFilter === 'free-del') matchesFilter = fee === 0;
        if (currentFilter === 'top-rated') matchesFilter = rating >= 4.8;

        if (matchesSearch && matchesFilter) {
          card.style.display = 'flex';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResults) {
        noResults.style.display = visible === 0 ? 'flex' : 'none';
      }
    };

    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilter();
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-outline');
        });
        btn.classList.add('active', 'btn-primary');
        btn.classList.remove('btn-outline');
        currentFilter = btn.getAttribute('data-filter');
        applyFilter();
      });
    });
  }
};

