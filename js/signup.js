/* Signup Page */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const pass = form.querySelector('input[type="password"]').value;
    const confirm = document.getElementById('confirmPass').value;

    if (pass !== confirm) {
      CartStore.showToast('Passwords do not match!');
      document.querySelector('.signup-card')?.classList.add('shake');
      setTimeout(() => document.querySelector('.signup-card')?.classList.remove('shake'), 500);
      return;
    }

    const users = JSON.parse(localStorage.getItem('freshharvest_users') || '[]');
    const email = form.querySelector('input[type="email"]').value;
    if (users.find(u => u.email === email)) {
      CartStore.showToast('Email already registered');
      return;
    }

    users.push({
      name: form.querySelector('input[type="text"]').value,
      email,
      phone: form.querySelector('input[type="tel"]').value
    });
    localStorage.setItem('freshharvest_users', JSON.stringify(users));

    CartStore.showToast('🎉 Account created! Please login.');
    setTimeout(() => window.location.href = 'login.html', 1200);
  });
});
