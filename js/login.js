/* Login Page */
let currentRole = 'customer';

const demoHints = {
  customer: 'Demo: user@freshharvest.com / user123',
  admin: 'Demo: admin@freshharvest.com / admin123',
  employee: 'Demo: employee@freshharvest.com / emp123'
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentRole = tab.dataset.role;
      document.getElementById('demoHint').textContent = demoHints[currentRole];
    });
  });

  document.getElementById('forgotLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    CartStore.showToast('Password reset link sent to your email!');
  });

  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const card = document.querySelector('.login-card');

    const session = AuthStore.login(email, password, currentRole);
    if (session) {
      CartStore.showToast(`Welcome, ${session.name}!`);
      setTimeout(() => {
        if (session.role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else if (session.role === 'employee') {
          window.location.href = 'employee-dashboard.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 600);
    } else {
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
      CartStore.showToast('Invalid email or password');
    }
  });
});
