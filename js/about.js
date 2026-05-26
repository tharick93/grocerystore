/* About Page */
document.addEventListener('DOMContentLoaded', () => {
  const team = [
    { name: 'Arjun Patel', role: 'CEO & Founder', emoji: '👨‍💼', bio: 'Visionary leader with 15 years in retail' },
    { name: 'Sneha Kapoor', role: 'COO', emoji: '👩‍💼', bio: 'Operations expert scaling delivery networks' },
    { name: 'Vikram Singh', role: 'Head of Quality', emoji: '👨‍🔬', bio: 'Ensures every product meets standards' },
    { name: 'Meera Joshi', role: 'CTO', emoji: '👩‍💻', bio: 'Building the tech behind fast delivery' }
  ];

  document.getElementById('teamGrid').innerHTML = team.map(m => `
    <div class="team-card reveal">
      <div class="team-avatar">${m.emoji}</div>
      <h3>${m.name}</h3>
      <p class="role">${m.role}</p>
      <p>${m.bio}</p>
    </div>
  `).join('');

  // New team cards are added after the global scroll-reveal observer
  // (initialized in `common.js`) has already run, so ensure they
  // become visible immediately by adding the `visible` class.
  document.querySelectorAll('#teamGrid .reveal').forEach(el => el.classList.add('visible'));
  const milestones = [
    { year: '2020', title: 'FreshHarvest Founded', desc: 'Launched in Mumbai with 50 products' },
    { year: '2021', title: '10 Cities Expansion', desc: 'Reached 10,000 daily orders milestone' },
    { year: '2022', title: 'Organic Line Launch', desc: 'Partnered with 100+ organic farms' },
    { year: '2023', title: 'Mobile App Release', desc: '1M+ app downloads in first year' },
    { year: '2024', title: '25 Cities Nationwide', desc: '50,000+ happy customers served' },
    { year: '2025', title: 'Best Grocery App Award', desc: 'Industry recognition for innovation' }
  ];

  document.getElementById('timeline').innerHTML = milestones.map(m => `
    <div class="timeline-item">
      <div class="timeline-year">${m.year}</div>
      <h3>${m.title}</h3>
      <p>${m.desc}</p>
    </div>
  `).join('');

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 150);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.timeline-item').forEach(el => timelineObserver.observe(el));
});
