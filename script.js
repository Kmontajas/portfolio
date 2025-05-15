// Show/Hide Sections on nav click
const links = document.querySelectorAll('a[data-target]');
const sections = document.querySelectorAll('.page-section');

function showSection(targetId) {
  sections.forEach(sec => {
    sec.style.display = (sec.id === targetId) ? 'block' : 'flex';
  });
}

showSection('home'); // Default to show home section initially

links.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.getAttribute('data-target');
    showSection(target);
  });
});

// Toggle navbar menu
const toggler = document.querySelector('.navbar-toggler');
const navMenu = document.querySelector('#navbarNav');

toggler.addEventListener('click', function() {
  navMenu.classList.toggle('show');
});

// IntersectionObserver for section visibility
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.2
});

// Observe each page section for visibility
sections.forEach(sec => {
  observer.observe(sec);
});

// Modal functionality for certificates
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const images = document.querySelectorAll(".certificate-img");
const closeBtn = document.querySelector(".close");

images.forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = img.src;
  });
});

closeBtn.onclick = () => modal.style.display = "flex";
window.onclick = e => {
  if (e.target === modal) modal.style.display = "flex";
};


    


