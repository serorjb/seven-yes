// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Highlight current page in nav
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });
});
