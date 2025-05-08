// Hide/show sections on nav click
const links = document.querySelectorAll('a[data-target]');
const sections = document.querySelectorAll('.page-section');


function showSection(targetId) {
  sections.forEach(sec => {
    sec.style.display = (sec.id === targetId) ? 'block' : 'flex';
  });
}


// Initial show Home
showSection('hero');


// On nav click
links.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.getAttribute('data-target');
    showSection(target);
  });
});


// Toggle hamburger menu
const toggler = document.querySelector('.navbar-toggler');
const navMenu = document.querySelector('#navbarNav');


toggler.addEventListener('click', function() {
  navMenu.classList.toggle('show');
});


// Fade-in animation when sections enter viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.2
});


// Observe sections
sections.forEach(section => {
  observer.observe(section);
});

document.addEventListener('DOMContentLoaded', () => {
  // Select all page sections
  const sections = document.querySelectorAll('.page-section');
  
  // Add the 'show' class to each section for a fade-in effect
  sections.forEach((section, index) => {
    setTimeout(() => {
      section.classList.add('show');
    }, index * 300); // Delay each section for a nice staggered effect
  });
});








