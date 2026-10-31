/**
 * FoodOrder - Food Item Detail & Customization Modal
 * Handles item options, add-ons, quantity adjustment, price calculation, and cart conflict resolution.
 */

import { store } from '../state/store.js';
import { Modal } from './Modal.js';
import { Toast } from './Toast.js';

export const FoodDetailModal = {
  open(foodId) {
    const food = store.getFoodItemById(foodId);
    if (!food) {
      Toast.error('Error', 'Food item not found.');
      return;
    }

    let currentQty = 1;
    let selectedOptions = [];

    // Pre-select first option of any required customization groups
    if (food.customizations && food.customizations.length > 0) {
      food.customizations.forEach(group => {
        if (group.required && group.options && group.options.length > 0) {
          selectedOptions.push({
            groupName: group.name,
            name: group.options[0].name,
            price: group.options[0].price
          });
        }
      });
    }

    const calculateCurrentPrice = () => {
      let unit = Number(food.price);
      selectedOptions.forEach(opt => {
        unit += Number(opt.price || 0);
      });
      return (unit * currentQty).toFixed(2);
    };

    const buildModalContent = () => {
      const isAvailable = food.available !== false;

      return `
        <div class="food-detail-view" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Food Image with Badges -->
          <div style="position: relative; width: 100%; height: 220px; border-radius: var(--radius-xl); overflow: hidden; background-color: var(--color-bg-subtle);">
            <img src="${food.image}" alt="${food.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
            <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px;">
              <span class="diet-indicator ${food.isVeg ? 'veg' : 'non-veg'}" title="${food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
              ${food.isChefSpecial ? '<span class="badge badge-warning">Chef Special</span>' : ''}
              ${food.isSpicy ? '<span class="badge badge-danger">🌶️ Spicy</span>' : ''}
              ${!isAvailable ? '<span class="badge badge-danger">Sold Out</span>' : ''}
            </div>
            <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); color: #FFF; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">
              ⭐ ${food.rating} (${food.ratingCount} reviews)
            </div>
          </div>

          <!-- Title & Restaurant -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 4px;">
              <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--color-text-main);">${food.name}</h3>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-primary-hover); white-space: nowrap;">
                $<span id="food-detail-price">${calculateCurrentPrice()}</span>
              </div>
            </div>
            <a href="#restaurant/${food.restaurantId}" style="font-size: 0.85rem; color: var(--color-text-muted); display: inline-flex; align-items: center; gap: 4px;" onclick="Modal.close();">
              🏪 ${food.restaurantName} &rarr;
            </a>
          </div>

          <!-- Description -->
          <p style="font-size: 0.9rem; color: var(--color-text-body); line-height: 1.6;">
            ${food.description}
          </p>

          <!-- Customizations Form -->
          ${food.customizations && food.customizations.length > 0 ? `
            <div style="border-top: 1px dashed var(--color-border); padding-top: 1rem;">
              <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-text-main);">
                Customize Your Dish
              </h4>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${food.customizations.map(group => `
                  <div class="custom-group">
                    <label style="font-size: 0.85rem; font-weight: 600; color: var(--color-text-main); display: block; margin-bottom: 6px;">
                      ${group.name} ${group.required ? '<span style="color: var(--color-accent-red); font-size: 11px;">(Required)</span>' : '<span style="color: var(--color-text-muted); font-size: 11px;">(Optional)</span>'}
                    </label>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                      ${group.options.map((opt, optIdx) => {
                        const isChecked = selectedOptions.some(s => s.groupName === group.name && s.name === opt.name);
                        const inputType = group.required ? 'radio' : 'checkbox';
                        const inputName = `group-${group.name.replace(/\s+/g, '-')}`;

                        return `
                          <label style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 8px 12px;
                            border: 1px solid var(--color-border);
                            border-radius: var(--radius-md);
                            cursor: pointer;
                            background-color: var(--color-bg-subtle);
                            font-size: 0.85rem;
                          ">
                            <span style="display: flex; align-items: center; gap: 8px;">
                              <input type="${inputType}" name="${inputName}" data-group="${group.name}" data-opt-name="${opt.name}" data-price="${opt.price}" ${isChecked ? 'checked' : ''} style="accent-color: var(--color-primary);">
                              ${opt.name}
                            </span>
                            <span style="font-weight: 600; color: var(--color-text-muted);">
                              ${opt.price > 0 ? `+$${Number(opt.price).toFixed(2)}` : 'Free'}
                            </span>
                          </label>
                        `;
                      }).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Quantity and Action Controls -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid var(--color-border);
            padding-top: 1.25rem;
            margin-top: 0.5rem;
          ">
            <div class="quantity-control">
              <button type="button" id="food-detail-qty-minus" aria-label="Decrease quantity">&minus;</button>
              <span class="qty-value" id="food-detail-qty-val">${currentQty}</span>
              <button type="button" id="food-detail-qty-plus" aria-label="Increase quantity">&plus;</button>
            </div>

            <button type="button" class="btn btn-primary" id="food-detail-add-btn" ${!isAvailable ? 'disabled' : ''} style="padding: 0.75rem 1.75rem;">
              ${isAvailable ? `Add to Cart &bull; $<span id="btn-total-price">${calculateCurrentPrice()}</span>` : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      `;
    };

    const modalEl = Modal.open({
      title: food.name,
      bodyContent: buildModalContent(),
      size: 'md'
    });

    const updatePricesInDom = () => {
      const priceText = calculateCurrentPrice();
      const priceSpan = modalEl.querySelector('#food-detail-price');
      const btnSpan = modalEl.querySelector('#btn-total-price');
      const qtySpan = modalEl.querySelector('#food-detail-qty-val');

      if (priceSpan) priceSpan.textContent = priceText;
      if (btnSpan) btnSpan.textContent = priceText;
      if (qtySpan) qtySpan.textContent = currentQty;
    };

    // Quantity buttons
    modalEl.querySelector('#food-detail-qty-minus').addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        updatePricesInDom();
      }
    });

    modalEl.querySelector('#food-detail-qty-plus').addEventListener('click', () => {
      if (currentQty < 20) {
        currentQty++;
        updatePricesInDom();
      }
    });

    // Customization inputs
    modalEl.querySelectorAll('input[data-group]').forEach(input => {
      input.addEventListener('change', () => {
        const groupName = input.getAttribute('data-group');
        const optName = input.getAttribute('data-opt-name');
        const price = Number(input.getAttribute('data-price') || 0);

        if (input.type === 'radio') {
          selectedOptions = selectedOptions.filter(o => o.groupName !== groupName);
          if (input.checked) {
            selectedOptions.push({ groupName, name: optName, price });
          }
        } else {
          // checkbox
          if (input.checked) {
            selectedOptions.push({ groupName, name: optName, price });
          } else {
            selectedOptions = selectedOptions.filter(o => !(o.groupName === groupName && o.name === optName));
          }
        }
        updatePricesInDom();
      });
    });

    // Add to Cart handler
    modalEl.querySelector('#food-detail-add-btn').addEventListener('click', () => {
      const result = store.addToCart(food, currentQty, selectedOptions, false);

      if (result.conflict) {
        // Multi-restaurant cart replacement protection!
        Modal.confirm({
          title: 'Replace Cart Items?',
          message: `Your cart already has items from <strong>${result.currentRestaurantName}</strong>. Do you want to clear your cart and start a fresh order from <strong>${result.newRestaurantName}</strong>?`,
          confirmText: 'Yes, Start New Order',
          cancelText: 'Keep Existing Cart',
          confirmClass: 'btn-primary',
          onConfirm: () => {
            store.addToCart(food, currentQty, selectedOptions, true);
            Modal.close();
            Toast.success('Cart Replaced!', `Added ${currentQty}x ${food.name} from ${food.restaurantName}.`);
          }
        });
        return;
      }

      Modal.close();
      Toast.success('Added to Cart! 🛒', `${currentQty}x ${food.name} added.`);
    });
  }
};

