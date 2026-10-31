/**
 * FoodOrder - Footer Component
 * Polished, accessible footer with brand info, quick links, cuisines list,
 * simulated newsletter subscription, and clear student/internship demo attribution.
 */

import { Toast } from './Toast.js';

export const Footer = {
  render() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <!-- Brand Column -->
            <div class="footer-brand">
              <div class="brand-logo" style="margin-bottom: 0.75rem;">
                <span class="logo-icon" style="width: 32px; height: 32px; font-size: 1rem;">🍔</span>
                <span style="color: #FFFFFF;">Food<span class="brand-highlight">Order</span></span>
              </div>
              <p style="font-size: 0.85rem; color: #9CA3AF; line-height: 1.6; margin-bottom: 1.25rem;">
                A comprehensive online food ordering & simulated delivery platform built for a free web development internship. High performance, zero external backend needed.
              </p>
              <div style="display: flex; gap: 0.75rem; font-size: 1.25rem;">
                <span title="Twitter / X" style="cursor: pointer;">🐦</span>
                <span title="Instagram" style="cursor: pointer;">📸</span>
                <span title="Facebook" style="cursor: pointer;">📘</span>
                <span title="GitHub" style="cursor: pointer;">🐙</span>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="footer-col">
              <h4>Quick Links</h4>
              <div class="footer-links">
                <a href="#home">Home</a>
                <a href="#restaurants">Browse Restaurants</a>
                <a href="#menu">Full Food Menu</a>
                <a href="#history">Order History & Reorder</a>
                <a href="#profile">Customer Profile</a>
                <a href="#dashboard">Restaurant Dashboard</a>
              </div>
            </div>

            <!-- Popular Cuisines -->
            <div class="footer-col">
              <h4>Food Categories</h4>
              <div class="footer-links">
                <a href="#menu?category=Pizza">🍕 Wood-Fired Pizza</a>
                <a href="#menu?category=Burgers">🍔 Smashed Burgers</a>
                <a href="#menu?category=Sushi">🍣 Japanese Sushi</a>
                <a href="#menu?category=Noodles">🍜 Authentic Noodles & Ramen</a>
                <a href="#menu?category=Salads">🥗 Organic Garden Salads</a>
                <a href="#menu?category=Desserts">🍰 Patisserie & Desserts</a>
              </div>
            </div>

            <!-- Newsletter Simulation & Demo Info -->
            <div class="footer-col">
              <h4>Get Secret Promos</h4>
              <p style="font-size: 0.85rem; color: #9CA3AF; margin-bottom: 0.75rem;">
                Subscribe for simulated secret flash coupons and free delivery codes!
              </p>
              <form id="newsletter-form" style="display: flex; gap: 6px; margin-bottom: 1rem;">
                <input type="email" id="newsletter-email" placeholder="Your email address" required style="
                  flex: 1;
                  padding: 8px 12px;
                  background-color: #1F2937;
                  border: 1px solid #374151;
                  border-radius: var(--radius-md);
                  color: #FFF;
                  font-size: 0.85rem;
                ">
                <button type="submit" class="btn btn-primary btn-sm">Join</button>
              </form>
              <div style="font-size: 0.75rem; color: #6B7280;">
                🔒 Simulated frontend demonstration. No real emails or payments collected.
              </div>
            </div>
          </div>

          <!-- Bottom Row -->
          <div class="footer-bottom">
            <div>
              &copy; 2026 <strong>FoodOrder</strong>. Built for Web Development Internship. All rights reserved.
            </div>
            <div style="display: flex; gap: 1rem; color: #9CA3AF;">
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
              <span>Cookie Settings</span>
              <span>Accessibility</span>
            </div>
          </div>
        </div>
      </footer>
    `;
  },

  attachEvents() {
    const form = document.getElementById('newsletter-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletter-email');
        if (input && input.value) {
          Toast.success('Subscribed! 🎉', `Welcome to the FoodOrder VIP list, ${input.value}. Use code FOODIE20 for 20% off!`);
          input.value = '';
        }
      });
    }
  }
};

