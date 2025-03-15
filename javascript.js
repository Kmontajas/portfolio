// Toggle Mobile Menu
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
}

// Toggle About Me Section
function toggleAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection.style.display === "none" || aboutSection.style.display === "") {
        aboutSection.style.display = "block";
    } else {
        aboutSection.style.display = "none";
    }
}

// Typewriter Effect for "Professional IT Web Developer"
const text = ["IT Web Developer", "UI/UX Designer", "Software Engineer"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";

function typeEffect() {
    if (count === text.length) {
        count = 0;
    }
    currentText = text[count];
    letter = currentText.slice(0, ++index);

    document.getElementById("typing-text").innerHTML = letter;

    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(typeEffect, 2000);
    } else {
        setTimeout(typeEffect, 100);
    }
}

document.addEventListener("DOMContentLoaded", typeEffect);

document.addEventListener("DOMContentLoaded", function () {
    // Select all links that start with #
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50, // Adjust offset if needed
                    behavior: "smooth"
                });
            }
        });
    });

});

document.addEventListener("DOMContentLoaded", function () {
    // Select all links that start with #
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50, // Adjust offset if needed
                    behavior: "smooth"
                });
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Select all links that start with #
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50, // Adjust offset if needed
                    behavior: "smooth"
                });
            }
        });
    });
});
