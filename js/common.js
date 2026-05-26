/* ============================================
   FreshHarvest — Shared JavaScript
   Theme, Cart, Navbar, Animations
   ============================================ */

const PRODUCTS = [
  { id: 1, name: 'Organic Bananas', category: 'fruits', price: 49, oldPrice: 65, emoji: '🍌', rating: 4.8 },
  { id: 2, name: 'Fresh Spinach', category: 'vegetables', price: 35, oldPrice: 45, emoji: '🥬', rating: 4.6 },
  { id: 3, name: 'Red Apples', category: 'fruits', price: 120, oldPrice: 150, emoji: '🍎', rating: 4.9 },
  { id: 4, name: 'Farm Tomatoes', category: 'vegetables', price: 40, oldPrice: 55, emoji: '🍅', rating: 4.7 },
  { id: 5, name: 'Avocado Pack', category: 'fruits', price: 199, oldPrice: 249, emoji: '🥑', rating: 4.8 },
  { id: 6, name: 'Baby Carrots', category: 'vegetables', price: 55, oldPrice: 70, emoji: '🥕', rating: 4.5 },
  { id: 7, name: 'Mixed Berries', category: 'fruits', price: 299, oldPrice: 349, emoji: '🫐', rating: 4.9 },
  { id: 8, name: 'Broccoli Crown', category: 'vegetables', price: 65, oldPrice: 80, emoji: '🥦', rating: 4.6 },
  { id: 9, name: 'Fresh Milk 1L', category: 'dairy', price: 58, oldPrice: 62, emoji: '🥛', rating: 4.7 },
  { id: 10, name: 'Whole Wheat Bread', category: 'bakery', price: 45, oldPrice: 55, emoji: '🍞', rating: 4.5 },
  { id: 11, name: 'Free Range Eggs', category: 'dairy', price: 89, oldPrice: 99, emoji: '🥚', rating: 4.8 },
  { id: 12, name: 'Orange Juice 1L', category: 'beverages', price: 99, oldPrice: 120, emoji: '🍊', rating: 4.6 },
];

const CATEGORIES = [
  { id: 'fruits', name: 'Fruits', emoji: '🍎', count: 45 },
  { id: 'vegetables', name: 'Vegetables', emoji: '🥦', count: 62 },
  { id: 'dairy', name: 'Dairy', emoji: '🥛', count: 28 },
  { id: 'bakery', name: 'Bakery', emoji: '🍞', count: 18 },
  { id: 'beverages', name: 'Beverages', emoji: '🧃', count: 34 },
  { id: 'snacks', name: 'Snacks', emoji: '🍿', count: 52 },
];

/* Cart Store — localStorage */
const CartStore = {
  key: 'freshharvest_cart',

  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(this.key, JSON.stringify(cart));
    this.updateBadge();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  },

  addItem(productId, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const cart = this.getCart();
    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
        qty
      });
    }
    this.saveCart(cart);
    this.showToast(`${product.name} added to cart!`);
  },

  removeItem(productId) {
    const cart = this.getCart().filter(i => i.id !== productId);
    this.saveCart(cart);
  },

  updateQty(productId, delta) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      this.removeItem(productId);
    } else {
      this.saveCart(cart);
    }
  },

  getTotal() {
    return this.getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getCount() {
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  clearCart() {
    this.saveCart([]);
  },

  updateBadge() {
    document.querySelectorAll('.cart-badge').forEach(badge => {
      const count = this.getCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  showToast(message) {
    let toast = document.querySelector('.cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'cart-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }
};

/* Theme */
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('freshharvest_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateToggleIcon(saved);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('freshharvest_theme', next);
    this.updateToggleIcon(next);
  },

  updateToggleIcon(theme) {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Light mode' : 'Dark mode');
    });
  }
};

/* Navbar */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* Page Loader */
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  document.body.classList.add('page-loading');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('page-loading');
      document.querySelector('main')?.classList.add('page-enter');
    }, 800);
  });
}

/* Scroll Reveal */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => observer.observe(el));
}

/* Ripple Effect */
function initRipple() {
  document.querySelectorAll('.btn, .cart-icon-btn, .add-cart-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* Animated Counters */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    let start = 0;
    const step = (timestamp) => {
      if (!el._startTime) el._startTime = timestamp;
      const progress = Math.min((timestamp - el._startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}

/* Product Card HTML helper */
function productCardHTML(product) {
  return `
    <article class="product-card reveal" data-id="${product.id}" data-category="${product.category}">
      <div class="product-img">${product.emoji}</div>
      <div class="product-body">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-cat">${product.category}</p>
        <p class="product-price">₹${product.price}<span class="old">₹${product.oldPrice}</span></p>
        <div class="product-footer">
          <span class="product-rating">★ ${product.rating}</span>
          <button class="btn btn-primary add-cart-btn" data-id="${product.id}">+ Cart</button>
        </div>
      </div>
    </article>`;
}

/* Bind add to cart buttons */
function bindAddToCart(container = document) {
  container.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      CartStore.addItem(parseInt(btn.dataset.id, 10));
    });
  });
}

/* Auth helpers */
const AuthStore = {
  key: 'freshharvest_user',

  login(email, password, role) {
    const users = {
      admin: { email: 'admin@freshharvest.com', password: 'admin123', role: 'admin', name: 'Admin User' },
      employee: { email: 'employee@freshharvest.com', password: 'emp123', role: 'employee', name: 'Delivery Staff' },
      customer: { email: 'user@freshharvest.com', password: 'user123', role: 'customer', name: 'John Customer' }
    };
    const user = users[role];
    if (user && user.email === email && user.password === password) {
      const session = { email, role: user.role, name: user.name };
      localStorage.setItem(this.key, JSON.stringify(session));
      return session;
    }
    return null;
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.key));
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(this.key);
  },

  isLoggedIn(role) {
    const user = this.getUser();
    return user && (!role || user.role === role);
  }
};

/* Toast styles injection */
(function injectToastStyles() {
  if (document.getElementById('toast-styles')) return;
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    .cart-toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(100px);
      background: var(--gradient-primary); color: white; padding: 14px 28px;
      border-radius: 50px; font-weight: 600; z-index: 9999; opacity: 0;
      transition: all 0.4s ease; box-shadow: var(--shadow-lg);
    }
    .cart-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  `;
  document.head.appendChild(style);
})();

/* Init common on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  initNavbar();
  initPageLoader();
  initScrollReveal();
  initRipple();
  animateCounters();
  CartStore.updateBadge();
  window.addEventListener('cartUpdated', () => CartStore.updateBadge());
});
