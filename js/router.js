/**
 * FoodOrder - Client-Side Single Page Application Router
 * Parses URL hash routes, extracts path and query parameters,
 * renders views, manages scroll position, and coordinates page lifecycles.
 */

import { Navbar } from './components/Navbar.js';
import { HomePage } from './pages/HomePage.js';
import { RestaurantsPage } from './pages/RestaurantsPage.js';
import { RestaurantPage } from './pages/RestaurantPage.js';
import { MenuPage } from './pages/MenuPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { TrackingPage } from './pages/TrackingPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AuthPage } from './pages/AuthPage.js';

class AppRouter {
  constructor() {
    this.routes = {
      '': HomePage,
      'home': HomePage,
      'restaurants': RestaurantsPage,
      'restaurant': RestaurantPage,
      'menu': MenuPage,
      'cart': CartPage,
      'checkout': CheckoutPage,
      'tracking': TrackingPage,
      'history': HistoryPage,
      'dashboard': DashboardPage,
      'profile': ProfilePage,
      'auth': AuthPage
    };

    this.container = null;
  }

  init(containerId = 'main-view') {
    this.container = document.getElementById(containerId);

    window.addEventListener('hashchange', () => this.handleRoute());
    window.FoodOrderNavigate = (hash) => {
      window.location.hash = hash;
    };
    window.FoodOrderRefresh = () => {
      this.handleRoute();
    };

    this.handleRoute();
  }

  handleRoute() {
    if (!this.container) return;

    // Parse hash and query string e.g. #restaurant/rest-1 or #menu?category=Pizza
    const rawHash = window.location.hash.slice(1) || 'home';
    const [pathPart, queryPart] = rawHash.split('?');
    const segments = pathPart.split('/').filter(Boolean);

    const baseRoute = segments[0] || 'home';
    const routeParam = segments[1] || null;

    // Parse query params
    const queryParams = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        queryParams[key] = val;
      });
    }

    const params = {
      id: routeParam,
      ...queryParams
    };

    const ViewComponent = this.routes[baseRoute];

    if (ViewComponent) {
      this.container.innerHTML = ViewComponent.render(params);
      window.scrollTo({ top: 0, behavior: 'instant' });

      if (typeof ViewComponent.attachEvents === 'function') {
        ViewComponent.attachEvents(params);
      }
    } else {
      // 404 / Route not found fallback
      this.container.innerHTML = `
        <div class="container" style="padding: 4rem 1rem;">
          <div class="empty-state">
            <div class="empty-state-icon">🧭</div>
            <h2 class="empty-state-title">Page Not Found</h2>
            <p class="empty-state-desc">The destination "${baseRoute}" does not exist in FoodOrder.</p>
            <a href="#home" class="btn btn-primary" style="margin-top: 1rem;">Back to Storefront &rarr;</a>
          </div>
        </div>
      `;
    }

    Navbar.updateActiveLink();
  }
}

export const Router = new AppRouter();
