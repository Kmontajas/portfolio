// Hide/show sections on nav click
const links = document.querySelectorAll('a[data-target]');
const sections = document.querySelectorAll('.page-section');

function showSection(targetId) {
  sections.forEach(sec => {
    sec.style.display = (sec.id === targetId) ? 'block' : 'none';
  });
}

// Initial: show Home only
showSection('hero');

// On nav click
links.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.getAttribute('data-target');
    showSection(target);
  });
});


