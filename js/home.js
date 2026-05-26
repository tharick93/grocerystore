/* FreshHarvest — Home Page JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  initTypingAnimation();
  initHeroSlider();
  renderCategories();
  renderProducts();
  initProductFilter();
  initCountdowns();
  initTestimonials();
  initFAQ();
  initNewsletter();
  initHeroSearch();
  bindAddToCart(document);
});

/* Typing animation */
function initTypingAnimation() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const phrases = [
    'Delivered in 10 minutes.',
    '100% organic & fresh.',
    'Best prices guaranteed.',
    'Free delivery above ₹499.'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  type();
}

/* Hero slider */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('sliderDots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.slider-dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  setInterval(() => goTo((current + 1) % slides.length), 5000);
}

/* Categories */
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card reveal" data-category="${cat.id}">
      <span class="cat-emoji">${cat.emoji}</span>
      <h3>${cat.name}</h3>
      <span>${cat.count}+ items</span>
    </div>
  `).join('');

  grid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === cat);
      });
      filterProducts(cat);
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* Products */
function renderProducts() {
  const popular = document.getElementById('popularProducts');
  const best = document.getElementById('bestSellers');
  const filterBar = document.getElementById('filterBar');

  if (filterBar) {
    const filters = ['all', ...new Set(PRODUCTS.map(p => p.category))];
    filterBar.innerHTML = filters.map(f => `
      <button class="filter-btn${f === 'all' ? ' active' : ''}" data-filter="${f}">
        ${f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    `).join('');
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProducts(btn.dataset.filter);
      });
    });
  }

  if (popular) {
    popular.innerHTML = PRODUCTS.slice(0, 8).map(p => productCardHTML(p)).join('');
  }
  if (best) {
    const sorted = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 4);
    best.innerHTML = sorted.map(p => productCardHTML(p)).join('');
  }
  bindAddToCart(document);
  initScrollReveal();
}

function initProductFilter() {
  filterProducts('all');
}

function filterProducts(category) {
  document.querySelectorAll('#popularProducts .product-card').forEach(card => {
    const match = category === 'all' || card.dataset.category === category;
    card.classList.toggle('hidden-filter', !match);
  });
}

/* Countdown timers */
function initCountdowns() {
  ['countdown1', 'countdown2', 'countdown3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const end = new Date();
    end.setDate(end.getDate() + 3 + i);
    end.setHours(23, 59, 59);

    function update() {
      const now = new Date();
      const diff = end - now;
      if (diff <= 0) {
        el.innerHTML = '<span>Offer ended</span>';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.innerHTML = `
        <div class="countdown-item"><span>${d}</span><small>Days</small></div>
        <div class="countdown-item"><span>${h}</span><small>Hrs</small></div>
        <div class="countdown-item"><span>${m}</span><small>Min</small></div>
        <div class="countdown-item"><span>${s}</span><small>Sec</small></div>
      `;
    }
    update();
    setInterval(update, 1000);
  });
}

/* Testimonials slider */
function initTestimonials() {
  const testimonials = [
    { avatar: '👩', text: 'FreshHarvest changed how I shop for groceries. Delivery is insanely fast and produce is always fresh!', author: 'Priya Sharma' },
    { avatar: '👨', text: 'Best prices and quality I have found online. The organic section is my go-to every week.', author: 'Rahul Mehta' },
    { avatar: '👩‍🦰', text: 'Love the app! Tracking orders in real-time and the customer support is excellent.', author: 'Ananya Reddy' }
  ];

  const track = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('testimonialDots');
  if (!track) return;

  track.innerHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-inner">
        <div class="testimonial-avatar">${t.avatar}</div>
        <p class="testimonial-text">"${t.text}"</p>
        <p class="testimonial-author">— ${t.author}</p>
      </div>
    </div>
  `).join('');

  let current = 0;
  if (dotsEl) {
    testimonials.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => { current = i; update(); });
      dotsEl.appendChild(dot);
    });
  }

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl?.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  setInterval(() => {
    current = (current + 1) % testimonials.length;
    update();
  }, 6000);
}

/* FAQ */
function initFAQ() {
  const faqs = [
    { q: 'What are your delivery timings?', a: 'We deliver 7 days a week from 6 AM to 11 PM. Express 10-minute delivery is available in select areas.' },
    { q: 'Is there a minimum order value?', a: 'Minimum order is ₹99. Free delivery on orders above ₹499.' },
    { q: 'How do I track my order?', a: 'Track live via our app or website after placing your order. You will receive SMS updates too.' },
    { q: 'What is your return policy?', a: 'Not satisfied? Report within 2 hours of delivery for instant refund or replacement on fresh items.' },
    { q: 'Do you sell organic products?', a: 'Yes! We have a dedicated organic section with certified farm-fresh produce.' }
  ];

  const list = document.getElementById('faqList');
  if (!list) return;

  list.innerHTML = faqs.map((f, i) => `
    <div class="faq-item${i === 0 ? ' open' : ''}">
      <button class="faq-question">${f.q}<span class="faq-icon">+</span></button>
      <div class="faq-answer"><p>${f.a}</p></div>
    </div>
  `).join('');

  list.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      list.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* Newsletter */
function initNewsletter() {
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    CartStore.showToast('🎉 Thanks for subscribing!');
    e.target.reset();
  });
}

/* Hero search */
function initHeroSearch() {
  document.getElementById('heroSearch')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = e.target.querySelector('input').value.toLowerCase();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    if (query) {
      document.querySelectorAll('#popularProducts .product-card').forEach(card => {
        const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
        card.classList.toggle('hidden-filter', !name.includes(query));
      });
    }
  });
}
