// Function to load file content and insert it into the code block
async function loadFileContent(filePath, elementId) {
  try {
    const response = await fetch(filePath);
    if (!response.ok)
      throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
    const content = await response.text();
    document.getElementById(elementId).textContent = content;
    Prism.highlightElement(document.getElementById(elementId)); // Reapply syntax highlighting
  } catch (error) {
    console.error(error);
    document.getElementById(elementId).textContent = "Error loading file.";
  }
}

// Function to copy code content to clipboard
function copyToClipboard(elementId) {
  const code = document.getElementById(elementId).innerText;
  navigator.clipboard
    .writeText(code)
    .then(() => {
      // Show a nicer notification
      const button = event.target.closest('button');
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Copied!';
      button.classList.add('btn-success');
      button.classList.remove('btn-primary');
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
      }, 2000);
    })
    .catch((err) => console.error("Could not copy text: ", err));
}

// Typing animation
const typingText = document.querySelector('.typing-text');
const phrases = [
  'Full Stack Developer',
  'DevOps Engineer',
  'Network Administrator'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  
  if (!isDeleting && charIndex <= currentPhrase.length) {
    typingText.textContent = currentPhrase.substring(0, charIndex);
    charIndex++;
    setTimeout(typeEffect, 100);
  } else if (isDeleting && charIndex >= 0) {
    typingText.textContent = currentPhrase.substring(0, charIndex);
    charIndex--;
    setTimeout(typeEffect, 50);
  } else if (!isDeleting && charIndex === currentPhrase.length + 1) {
    isDeleting = true;
    setTimeout(typeEffect, 1000);
  } else if (isDeleting && charIndex === -1) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    charIndex = 0;
    setTimeout(typeEffect, 200);
  }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Close mobile menu if open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    }
  });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
  } else {
    navbar.style.background = 'rgba(10, 10, 15, 0.9)';
    navbar.style.boxShadow = 'none';
  }
});

// Initialize AOS (Animate On Scroll)
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });
}

// Load contents on page load
window.addEventListener("DOMContentLoaded", () => {
  loadFileContent("ssh", "sshCode");
  loadFileContent("signing", "signing");
  
  // Windows Repair and Send scripts are now shown as commands, not loaded
  // Highlight them with Prism
  Prism.highlightElement(document.getElementById("windowsRepairCode"));
  Prism.highlightElement(document.getElementById("sendCode"));
  
  // Start typing animation
  setTimeout(typeEffect, 500);
  
  // Add entrance animation to elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.skill-card, .stat-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
});

// Particle effect on mouse move (subtle)
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  const orbs = document.querySelectorAll('.gradient-orb');
  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 0.01;
    const x = (mouseX - window.innerWidth / 2) * speed;
    const y = (mouseY - window.innerHeight / 2) * speed;
    
    orb.style.transform = `translate(${x}px, ${y}px)`;
  });
});
