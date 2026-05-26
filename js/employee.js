/* Employee Dashboard */
document.addEventListener('DOMContentLoaded', () => {
  if (!AuthStore.isLoggedIn('employee')) {
    window.location.href = 'login.html';
    return;
  }

  const user = AuthStore.getUser();
  document.getElementById('empName').textContent = user?.name || 'Employee';

  initSidebar();
  initEmpSections();
  renderTasks();
  renderAssignedOrders();
  renderTracking();
  renderStock();
  renderCustomerDetails();
  animateCounters();

  document.getElementById('empLogout')?.addEventListener('click', (e) => {
    e.preventDefault();
    AuthStore.logout();
    window.location.href = 'login.html';
  });
});

function initSidebar() {
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

function initEmpSections() {
  const titles = {
    overview: 'Employee Overview',
    orders: 'Assigned Orders',
    tracking: 'Delivery Tracking',
    stock: 'Stock Updates',
    customers: 'Customer Details'
  };

  document.querySelectorAll('.sidebar-nav a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
      document.getElementById('section-' + section)?.classList.add('active');
      document.getElementById('empTitle').textContent = titles[section];
      document.getElementById('sidebar')?.classList.remove('open');
    });
  });
}

function renderTasks() {
  const tasks = [
    { icon: '📦', title: 'Pack Orders', progress: 75 },
    { icon: '🚴', title: 'Deliveries', progress: 60 },
    { icon: '📋', title: 'Stock Check', progress: 90 }
  ];

  document.getElementById('taskCards').innerHTML = tasks.map(t => `
    <div class="task-card reveal">
      <div class="task-icon">${t.icon}</div>
      <h3>${t.title}</h3>
      <div class="task-progress-ring">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" stroke-width="6"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--primary)" stroke-width="6"
            stroke-dasharray="${2 * Math.PI * 34}" stroke-dashoffset="${2 * Math.PI * 34 * (1 - t.progress / 100)}"
            stroke-linecap="round"/>
        </svg>
        <span>${t.progress}%</span>
      </div>
    </div>
  `).join('');
}

const deliveries = [
  { id: 'ORD1001', customer: 'Priya Sharma', address: '12 Green Ave, Mumbai', items: 3, progress: 25, step: 0 },
  { id: 'ORD1002', customer: 'Rahul Mehta', address: '45 Park Street, Mumbai', items: 2, progress: 60, step: 1 },
  { id: 'ORD1003', customer: 'Ananya Reddy', address: '78 Lake Road, Mumbai', items: 5, progress: 90, step: 2 },
  { id: 'ORD1004', customer: 'Vikram Singh', address: '3 Hill View, Mumbai', items: 1, progress: 10, step: 0 }
];

const steps = ['Picked', 'In Transit', 'Delivered'];

function deliveryCardHTML(d) {
  return `
    <div class="delivery-card">
      <div class="delivery-header">
        <h3>${d.id} — ${d.customer}</h3>
        <span class="status-badge status-processing">${d.progress < 100 ? 'Active' : 'Done'}</span>
      </div>
      <p style="color:var(--text-muted);font-size:0.9rem">📍 ${d.address} · ${d.items} items</p>
      <div class="delivery-progress"><div class="delivery-progress-bar" style="width:${d.progress}%"></div></div>
      <div class="delivery-steps">
        ${steps.map((s, i) => `<span class="${i <= d.step ? 'active' : ''}">${s}</span>`).join('')}
      </div>
      <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="updateDelivery('${d.id}')">Update Status</button>
    </div>`;
}

function renderAssignedOrders() {
  document.getElementById('assignedOrders').innerHTML = deliveries.map(deliveryCardHTML).join('');
}

function renderTracking() {
  document.getElementById('trackingList').innerHTML = deliveries.map(d => `
    <div class="delivery-card">
      <div class="delivery-header"><h3>🚴 ${d.id}</h3><span>${d.progress}% complete</span></div>
      <p>Delivering to <strong>${d.customer}</strong></p>
      <div class="delivery-progress"><div class="delivery-progress-bar" style="width:${d.progress}%"></div></div>
    </div>
  `).join('');
}

window.updateDelivery = function (id) {
  const d = deliveries.find(x => x.id === id);
  if (d && d.progress < 100) {
    d.progress = Math.min(100, d.progress + 30);
    d.step = Math.min(2, Math.floor(d.progress / 34));
    renderAssignedOrders();
    renderTracking();
    CartStore.showToast(`Order ${id} updated to ${d.progress}%`);
  }
};

function renderStock() {
  const stock = [
    { emoji: '🍌', name: 'Bananas', qty: 45, low: false },
    { emoji: '🥬', name: 'Spinach', qty: 8, low: true },
    { emoji: '🥛', name: 'Milk', qty: 32, low: false },
    { emoji: '🍞', name: 'Bread', qty: 5, low: true },
    { emoji: '🍎', name: 'Apples', qty: 60, low: false },
    { emoji: '🥕', name: 'Carrots', qty: 22, low: false }
  ];

  document.getElementById('stockGrid').innerHTML = stock.map(s => `
    <div class="stock-item ${s.low ? 'stock-low' : ''}">
      <span>${s.emoji}</span>
      <div><strong>${s.name}</strong><br><small>${s.qty} units ${s.low ? '— LOW STOCK' : ''}</small></div>
      <button class="btn-sm btn-edit" onclick="CartStore.showToast('Stock updated for ${s.name}')">Update</button>
    </div>
  `).join('');
}

function renderCustomerDetails() {
  document.getElementById('customerDetails').innerHTML = deliveries.map(d => `
    <div class="customer-detail-card">
      <strong>${d.customer}</strong>
      <p style="color:var(--text-muted);font-size:0.9rem;margin-top:6px">
        Order: ${d.id}<br>
        📍 ${d.address}<br>
        📞 +91 98XXX XXXXX
      </p>
    </div>
  `).join('');
}
