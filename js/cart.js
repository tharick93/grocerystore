/* Cart Page */
let promoDiscount = 0;

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  window.addEventListener('cartUpdated', renderCart);

  document.getElementById('clearCart')?.addEventListener('click', () => {
    if (confirm('Clear all items from cart?')) {
      CartStore.clearCart();
      renderCart();
    }
  });

  document.getElementById('applyPromo')?.addEventListener('click', () => {
    const code = document.getElementById('promoCode')?.value.trim().toUpperCase();
    if (code === 'FRESH40') {
      promoDiscount = 0.4;
      CartStore.showToast('40% discount applied!');
    } else if (code === 'SAVE10') {
      promoDiscount = 0.1;
      CartStore.showToast('10% discount applied!');
    } else {
      promoDiscount = 0;
      CartStore.showToast('Invalid promo code');
    }
    updateSummary();
  });

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    const cart = CartStore.getCart();
    if (!cart.length) {
      CartStore.showToast('Cart is empty!');
      return;
    }
    document.getElementById('checkoutSection').style.display = 'block';
    document.getElementById('checkoutSection').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const orders = JSON.parse(localStorage.getItem('freshharvest_orders') || '[]');
    orders.push({
      id: 'ORD' + Date.now(),
      items: CartStore.getCart(),
      total: getTotal(),
      date: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('freshharvest_orders', JSON.stringify(orders));
    CartStore.clearCart();
    promoDiscount = 0;
    renderCart();
    CartStore.showToast('🎉 Order placed successfully!');
    document.getElementById('checkoutSection').style.display = 'none';
    e.target.reset();
  });
});

function renderCart() {
  const cart = CartStore.getCart();
  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('emptyCart');
  const countEl = document.getElementById('cartCount');

  if (countEl) countEl.textContent = CartStore.getCount();

  if (!cart.length) {
    if (itemsEl) itemsEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    updateSummary();
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  if (itemsEl) {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="price">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</p>
        </div>
        <div class="qty-controls">
          <button class="qty-btn qty-minus" data-id="${item.id}">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}" aria-label="Remove">🗑️</button>
      </div>
    `).join('');

    itemsEl.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => CartStore.updateQty(parseInt(btn.dataset.id), -1));
    });
    itemsEl.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => CartStore.updateQty(parseInt(btn.dataset.id), 1));
    });
    itemsEl.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => CartStore.removeItem(parseInt(btn.dataset.id)));
    });
  }

  updateSummary();
}

function getSubtotal() {
  return CartStore.getTotal();
}

function getDelivery() {
  return getSubtotal() >= 499 ? 0 : 40;
}

function getDiscount() {
  return Math.floor(getSubtotal() * promoDiscount);
}

function getTotal() {
  return getSubtotal() + getDelivery() - getDiscount();
}

function updateSummary() {
  const sub = getSubtotal();
  const del = getDelivery();
  const disc = getDiscount();
  const total = sub + del - disc;

  document.getElementById('subtotal').textContent = '₹' + sub;
  document.getElementById('delivery').textContent = del === 0 ? 'FREE' : '₹' + del;
  document.getElementById('discount').textContent = disc > 0 ? '-₹' + disc : '-₹0';
  document.getElementById('total').textContent = '₹' + total;
}
