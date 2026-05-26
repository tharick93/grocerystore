/* Services Page */
document.addEventListener('DOMContentLoaded', () => {
  const services = [
    { icon: '⚡', title: 'Fast Delivery', desc: '10-minute express delivery in metro areas. Same-day delivery everywhere else.' },
    { icon: '🌿', title: 'Organic Products', desc: 'Certified organic fruits, vegetables, dairy & pantry items from trusted farms.' },
    { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock customer support via chat, call, and email.' },
    { icon: '💳', title: 'Online Payment', desc: 'UPI, cards, wallets, and COD. Secure encrypted transactions.' },
    { icon: '📍', title: 'Delivery Tracking', desc: 'Real-time GPS tracking from warehouse to your doorstep.' },
    { icon: '🚜', title: 'Fresh Farm Products', desc: 'Direct-from-farm produce harvested and delivered same day.' },
    { icon: '🎁', title: 'Gift Hampers', desc: 'Curated gift boxes for festivals, birthdays & corporate gifting.' },
    { icon: '🔄', title: 'Easy Returns', desc: 'Hassle-free returns on damaged or unsatisfactory items within 2 hours.' }
  ];

  document.getElementById('servicesGrid').innerHTML = services.map(s => `
    <div class="service-card reveal">
      <span class="service-icon">${s.icon}</span>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </div>
  `).join('');

  const plans = [
    { name: 'Basic', price: 0, period: '/month', features: ['Free delivery above ₹499', 'Standard support', 'Weekly deals'], featured: false },
    { name: 'Gold', price: 99, period: '/month', features: ['Free delivery on all orders', 'Priority support', 'Exclusive discounts', 'Early sale access'], featured: true },
    { name: 'Platinum', price: 199, period: '/month', features: ['Unlimited free delivery', '24/7 VIP support', '20% extra off sales', 'Free gift wrapping', 'Birthday surprise box'], featured: false }
  ];

  document.getElementById('plansGrid').innerHTML = plans.map(p => `
    <div class="plan-card reveal ${p.featured ? 'featured' : ''}">
      <h3>${p.name}</h3>
      <div class="plan-price">₹${p.price}<span>${p.period}</span></div>
      <ul class="plan-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <button class="btn ${p.featured ? 'btn-accent' : 'btn-outline'} plan-btn">Choose Plan</button>
    </div>
  `).join('');

  // Make newly injected reveal elements visible immediately
  // (global scroll-reveal observer was initialized earlier in `common.js`).
  document.querySelectorAll('#servicesGrid .reveal, #plansGrid .reveal').forEach(el => el.classList.add('visible'));
  document.querySelectorAll('.plan-btn').forEach(btn => {
    btn.addEventListener('click', () => CartStore.showToast('Plan selected! Complete signup to activate.'));
  });
});
