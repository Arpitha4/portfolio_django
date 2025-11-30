document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
});
