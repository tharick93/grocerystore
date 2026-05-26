/* Contact Page */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    CartStore.showToast('✅ Message sent! We\'ll reply within 24 hours.');
    e.target.reset();
  });

  const faqs = [
    { q: 'How do I contact support?', a: 'Use live chat, call +91 98765 43210, or email hello@freshharvest.com.' },
    { q: 'Can I visit your office?', a: 'Yes! Visit us at 123 Green Street, Mumbai. Mon–Fri 9 AM – 6 PM.' },
    { q: 'Do you accept bulk orders?', a: 'Contact us for corporate and bulk orders with special pricing.' }
  ];

  document.getElementById('contactFaq').innerHTML = faqs.map(f => `
    <div class="faq-acc-item">
      <button class="faq-acc-btn">${f.q}<span>+</span></button>
      <div class="faq-acc-body"><p>${f.a}</p></div>
    </div>
  `).join('');

  document.querySelectorAll('.faq-acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-acc-item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatMessages = document.getElementById('chatMessages');

  chatToggle?.addEventListener('click', () => chatPanel.classList.toggle('open'));
  chatClose?.addEventListener('click', () => chatPanel.classList.remove('open'));

  const botReplies = [
    'Thanks for reaching out! A support agent will assist you shortly.',
    'You can track orders in the Cart section after login.',
    'For refunds, report within 2 hours of delivery via the app.'
  ];

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = chatForm.querySelector('input');
    const text = input.value.trim();
    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);

    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg bot';
      botMsg.textContent = botReplies[Math.floor(Math.random() * botReplies.length)];
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);

    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
});
