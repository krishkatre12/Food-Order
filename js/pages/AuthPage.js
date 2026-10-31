/**
 * FoodOrder - Authentication View (Module K)
 * Safe demo authentication for Customer, Restaurant Owner, and Admin personas.
 * Features tabs for Login & Register, form validation, and 1-click demo login buttons.
 */

import { store } from '../state/store.js';
import { Toast } from '../components/Toast.js';

export const AuthPage = {
  render() {
    const user = store.getCurrentUser();

    if (user) {
      return `
        <div class="auth-page container" style="max-width: 520px; padding: 4rem 1rem;">
          <div class="checkout-card" style="text-align: center;">
            <div class="user-avatar" style="width: 64px; height: 64px; font-size: 1.5rem; margin: 0 auto 1rem;">
              ${user.avatar || 'U'}
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-text-main); margin-bottom: 4px;">
              Already Signed In
            </h2>
            <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
              You are currently logged in as <strong>${user.name}</strong> (${user.role}).
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <a href="#profile" class="btn btn-primary btn-full">View My Profile &rarr;</a>
              ${user.role === 'owner' || user.role === 'admin' ? `
                <a href="#dashboard" class="btn btn-outline btn-full">Go to Restaurant Dashboard &rarr;</a>
              ` : ''}
              <button type="button" class="btn btn-danger btn-full" id="auth-signout-btn">Sign Out</button>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="auth-page container" style="max-width: 540px; padding: 3rem 1rem;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 2rem;">
          <a href="#home" class="brand-logo" style="justify-content: center; margin-bottom: 0.5rem;">
            <span class="logo-icon">🍔</span>
            <span>Food<span class="brand-highlight">Order</span></span>
          </a>
          <p style="font-size: 0.9rem; color: var(--color-text-muted);">
            Sign in to track orders, save delivery addresses, and enjoy custom dishes.
          </p>
        </div>

        <!-- 1-Click Quick Demo Login Shortcuts (For Internship Evaluators) -->
        <div style="
          background-color: var(--color-primary-light);
          border: 1px solid var(--color-primary-border);
          border-radius: var(--radius-xl);
          padding: 1.25rem;
          margin-bottom: 1.75rem;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <strong style="color: #92400E; font-size: 0.9rem;">⚡ 1-Click Internship Demo Accounts:</strong>
            <span class="badge badge-primary">No Password Required</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button type="button" class="btn btn-outline btn-sm quick-login-btn" data-role="customer" style="justify-content: space-between; background: #FFF;">
              <span>👤 <strong>Customer:</strong> Sarah Connor</span>
              <span style="color: var(--color-primary-hover); font-weight: 700;">Sign in &rarr;</span>
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-login-btn" data-role="owner" style="justify-content: space-between; background: #FFF;">
              <span>👨‍🍳 <strong>Owner:</strong> Chef Marco (Bella Italia)</span>
              <span style="color: var(--color-primary-hover); font-weight: 700;">Sign in &rarr;</span>
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-login-btn" data-role="admin" style="justify-content: space-between; background: #FFF;">
              <span>🏢 <strong>Admin:</strong> Alex Admin</span>
              <span style="color: var(--color-primary-hover); font-weight: 700;">Sign in &rarr;</span>
            </button>
          </div>
        </div>

        <!-- Form Card with Login / Register Tabs -->
        <div class="checkout-card">
          <div class="tab-list" id="auth-tabs" style="margin-bottom: 1.5rem;">
            <button class="tab-btn active" data-tab="login" style="flex: 1; text-align: center;">Sign In</button>
            <button class="tab-btn" data-tab="register" style="flex: 1; text-align: center;">Create Account</button>
          </div>

          <!-- SIGN IN FORM -->
          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Email Address <span class="required">*</span></label>
              <input type="email" id="login-email" class="form-control" placeholder="sarah@example.com" value="sarah@example.com" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Password <span class="required">*</span></label>
              <input type="password" id="login-password" class="form-control" placeholder="••••••••" value="demo123" required>
              <span class="form-helper">For this frontend demo, any password is valid for registered emails.</span>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg" style="margin-top: 1rem;">
              Sign In to FoodOrder &rarr;
            </button>
          </form>

          <!-- REGISTER FORM -->
          <form id="register-form" style="display: none;">
            <div class="form-group">
              <label class="form-label" for="reg-name">Full Name <span class="required">*</span></label>
              <input type="text" id="reg-name" class="form-control" placeholder="e.g. Mia Sara" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-email">Email Address <span class="required">*</span></label>
              <input type="email" id="reg-email" class="form-control" placeholder="mia@example.com" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-phone">Phone Number <span class="required">*</span></label>
              <input type="tel" id="reg-phone" class="form-control" placeholder="+1 (555) 012-3456" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-role">Account Type <span class="required">*</span></label>
              <select id="reg-role" class="form-control" required>
                <option value="customer">Customer (Order food & track delivery)</option>
                <option value="owner">Restaurant Owner (Manage menu & incoming orders)</option>
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="reg-password">Password <span class="required">*</span></label>
                <input type="password" id="reg-password" class="form-control" placeholder="••••••••" required minlength="6">
              </div>
              <div class="form-group">
                <label class="form-label" for="reg-confirm">Confirm Password <span class="required">*</span></label>
                <input type="password" id="reg-confirm" class="form-control" placeholder="••••••••" required minlength="6">
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg" style="margin-top: 1rem;">
              Create My Account &rarr;
            </button>
          </form>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Sign out if already logged in
    document.getElementById('auth-signout-btn')?.addEventListener('click', () => {
      store.logout();
      Toast.info('Signed Out', 'You have been logged out.');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });

    // 1-Click demo accounts
    document.querySelectorAll('.quick-login-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        const user = store.switchDemoUser(role);
        if (user) {
          Toast.success(`Welcome ${user.name}! 👋`, `Signed in as ${user.role}.`);
          if (role === 'owner' || role === 'admin') {
            window.location.hash = '#dashboard';
          } else {
            window.location.hash = '#home';
          }
        }
      });
    });

    // Tab switcher between Login and Register
    const tabs = document.querySelectorAll('#auth-tabs .tab-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const which = tab.getAttribute('data-tab');

        if (which === 'login') {
          loginForm.style.display = 'block';
          registerForm.style.display = 'none';
        } else {
          loginForm.style.display = 'none';
          registerForm.style.display = 'block';
        }
      });
    });

    // Login Form Submit
    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (!email || !password) {
        Toast.error('Validation Error', 'Please enter both email and password.');
        return;
      }

      const res = store.login(email, password);
      if (res.success) {
        Toast.success(`Welcome Back, ${res.user.name.split(' ')[0]}! 👋`, `Signed in successfully.`);
        if (res.user.role === 'owner' || res.user.role === 'admin') {
          window.location.hash = '#dashboard';
        } else {
          window.location.hash = '#home';
        }
      } else {
        Toast.error('Login Failed', res.message);
      }
    });

    // Register Form Submit
    registerForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const role = document.getElementById('reg-role').value;
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;

      if (!name || !email || !phone) {
        Toast.error('Validation Error', 'All fields are mandatory.');
        return;
      }

      if (password !== confirm) {
        Toast.error('Password Mismatch', 'Password and confirmation fields do not match.');
        return;
      }

      if (password.length < 6) {
        Toast.error('Password Too Short', 'Password must be at least 6 characters long.');
        return;
      }

      const res = store.register({
        name,
        email,
        phone,
        role
      });

      if (res.success) {
        Toast.success('Account Created! 🎉', `Welcome to FoodOrder, ${name}!`);
        if (role === 'owner') {
          window.location.hash = '#dashboard';
        } else {
          window.location.hash = '#home';
        }
      } else {
        Toast.error('Registration Error', res.message);
      }
    });
  }
};
