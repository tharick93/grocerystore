/* Admin Dashboard */
document.addEventListener('DOMContentLoaded', () => {
  if (!AuthStore.isLoggedIn('admin')) {
    window.location.href = 'login.html';
    return;
  }

  const user = AuthStore.getUser();
  document.getElementById('adminName').textContent = user?.name || 'Admin';

  initSidebar();
  initSections();
  initNotifications();
  initActivity();
  renderOrders();
  renderCustomers();
  renderAdminProducts();
  initProductForm();
  drawChart('salesChart', [42000, 55000, 48000, 62000, 71000, 68000, 85000], ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']);
  drawChart('revenueChart', [120000, 145000, 132000, 168000, 190000, 175000, 210000], ['Jan','Feb','Mar','Apr','May','Jun','Jul'], '#ff7b2e');

  document.getElementById('adminLogout')?.addEventListener('click', (e) => {
    e.preventDefault();
    AuthStore.logout();
    window.location.href = 'login.html';
  });

  animateCounters();
});

function initSidebar() {
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

function initSections() {
  const titles = {
    overview: 'Dashboard Overview',
    products: 'Product Management',
    orders: 'Orders Management',
    customers: 'Customer List',
    analytics: 'Sales Analytics'
  };

  document.querySelectorAll('.sidebar-nav a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
      document.getElementById('section-' + section)?.classList.add('active');
      document.getElementById('dashTitle').textContent = titles[section] || 'Dashboard';
      document.getElementById('sidebar')?.classList.remove('open');
    });
  });
}

function getAdminProducts() {
  return JSON.parse(localStorage.getItem('freshharvest_admin_products') || 'null') || [...PRODUCTS];
}

function saveAdminProducts(products) {
  localStorage.setItem('freshharvest_admin_products', JSON.stringify(products));
}

function renderAdminProducts() {
  const products = getAdminProducts();
  const list = document.getElementById('adminProductList');
  if (!list) return;

  list.innerHTML = products.map(p => `
    <div class="admin-product-item" data-id="${p.id}">
      <div style="display:flex;align-items:center;flex:1">
        <span>${p.emoji}</span>
        <div><strong>${p.name}</strong><br><small>₹${p.price} · ${p.category}</small></div>
      </div>
      <div class="admin-actions">
        <button class="btn-sm btn-edit" data-edit="${p.id}">Edit</button>
        <button class="btn-sm btn-delete" data-del="${p.id}">Delete</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this product?')) {
        const products = getAdminProducts().filter(p => p.id !== parseInt(btn.dataset.del));
        saveAdminProducts(products);
        renderAdminProducts();
      }
    });
  });

  list.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = getAdminProducts().find(x => x.id === parseInt(btn.dataset.edit));
      if (p) {
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodPrice').value = p.price;
        document.getElementById('prodCategory').value = p.category;
        document.getElementById('prodEmoji').value = p.emoji;
        document.getElementById('productForm').dataset.editId = p.id;
      }
    });
  });
}

function initProductForm() {
  document.getElementById('productForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const products = getAdminProducts();
    const editId = e.target.dataset.editId;

    const newProd = {
      id: editId ? parseInt(editId) : Date.now(),
      name: document.getElementById('prodName').value,
      price: parseInt(document.getElementById('prodPrice').value),
      category: document.getElementById('prodCategory').value,
      emoji: document.getElementById('prodEmoji').value || '📦',
      oldPrice: parseInt(document.getElementById('prodPrice').value) + 20,
      rating: 4.5
    };

    if (editId) {
      const idx = products.findIndex(p => p.id === parseInt(editId));
      if (idx >= 0) products[idx] = newProd;
      delete e.target.dataset.editId;
    } else {
      products.push(newProd);
    }

    saveAdminProducts(products);
    renderAdminProducts();
    e.target.reset();
    CartStore.showToast(editId ? 'Product updated!' : 'Product added!');
  });
}

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('freshharvest_orders') || '[]');
  const sampleOrders = orders.length ? orders : [
    { id: 'ORD1001', items: [{ name: 'Bananas', qty: 2 }], total: 98, date: new Date().toISOString(), status: 'pending' },
    { id: 'ORD1002', items: [{ name: 'Milk', qty: 1 }], total: 58, date: new Date(Date.now() - 86400000).toISOString(), status: 'delivered' },
    { id: 'ORD1003', items: [{ name: 'Apples', qty: 3 }], total: 360, date: new Date(Date.now() - 172800000).toISOString(), status: 'processing' }
  ];

  const statusClass = s => s === 'delivered' ? 'delivered' : s === 'processing' ? 'processing' : 'pending';

  const rowHTML = o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.items?.length || 0} items</td>
      <td>₹${o.total}</td>
      <td><span class="status-badge status-${statusClass(o.status)}">${o.status}</span></td>
    </tr>`;

  document.getElementById('recentOrders').innerHTML = sampleOrders.slice(0, 5).map(rowHTML).join('');
  document.getElementById('allOrdersTable').innerHTML = sampleOrders.map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${new Date(o.date).toLocaleDateString()}</td>
      <td>${o.items?.length || 0}</td>
      <td>₹${o.total}</td>
      <td><span class="status-badge status-${statusClass(o.status)}">${o.status}</span></td>
      <td><button class="btn-sm btn-edit" onclick="alert('Order ${o.id} marked delivered')">Update</button></td>
    </tr>
  `).join('');
}

function initNotifications() {
  const notifs = [
    { text: 'New order #ORD1248 received', time: '2 min ago' },
    { text: 'Low stock alert: Organic Spinach', time: '15 min ago' },
    { text: 'Customer review: 5 stars', time: '1 hr ago' },
    { text: 'Payment received ₹1,240', time: '2 hrs ago' }
  ];
  document.getElementById('notificationsList').innerHTML = notifs.map(n => `
    <div class="notif-item">${n.text}<time>${n.time}</time></div>
  `).join('');
}

function initActivity() {
  const activities = [
    { text: 'Admin updated product pricing', time: '10 min ago' },
    { text: 'New customer registered', time: '25 min ago' },
    { text: 'Order ORD1245 delivered', time: '1 hr ago' },
    { text: 'Weekly report generated', time: '3 hrs ago' }
  ];
  document.getElementById('activityList').innerHTML = activities.map(a => `
    <div class="activity-item">${a.text}<time>${a.time}</time></div>
  `).join('');
}

function renderCustomers() {
  const customers = [
    { name: 'Priya Sharma', email: 'priya@email.com', orders: 24 },
    { name: 'Rahul Mehta', email: 'rahul@email.com', orders: 18 },
    { name: 'Ananya Reddy', email: 'ananya@email.com', orders: 31 },
    { name: 'Vikram Singh', email: 'vikram@email.com', orders: 12 },
    { name: 'Meera Joshi', email: 'meera@email.com', orders: 45 }
  ];
  document.getElementById('customerList').innerHTML = customers.map(c => `
    <div class="customer-item">
      <div class="customer-avatar">${c.name[0]}</div>
      <div><strong>${c.name}</strong><br><small>${c.email} · ${c.orders} orders</small></div>
    </div>
  `).join('');
}

function drawChart(canvasId, data, labels, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width;
  const h = rect.height;
  const max = Math.max(...data);
  const barColor = color || getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#2d9f4e';
  const padding = 40;
  const barWidth = (w - padding * 2) / data.length - 12;

  ctx.clearRect(0, 0, w, h);
  data.forEach((val, i) => {
    const barH = ((val / max) * (h - padding * 2));
    const x = padding + i * (barWidth + 12);
    const y = h - padding - barH;
    const gradient = ctx.createLinearGradient(0, y, 0, h - padding);
    gradient.addColorStop(0, barColor);
    gradient.addColorStop(1, barColor + '44');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, 6);
    ctx.fill();
    ctx.fillStyle = getComputedStyle(document.body).color || '#5a6b5e';
    ctx.font = '11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, h - 12);
  });
}

window.addEventListener('resize', () => {
  drawChart('salesChart', [42000, 55000, 48000, 62000, 71000, 68000, 85000], ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']);
  drawChart('revenueChart', [120000, 145000, 132000, 168000, 190000, 175000, 210000], ['Jan','Feb','Mar','Apr','May','Jun','Jul'], '#ff7b2e');
});
