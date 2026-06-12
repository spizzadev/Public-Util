// =============================================
// PREFERENCES
// =============================================
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

// =============================================
// FILE LOADING - SSH keys
// =============================================
async function loadFileContent(filePath, elementId) {
  try {
    const response = await fetch(filePath);
    if (!response.ok)
      throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
    const content = await response.text();
    const el = document.getElementById(elementId);
    el.textContent = content.trim();
    Prism.highlightElement(el);
  } catch (err) {
    console.error(err);
    document.getElementById(elementId).textContent = "Error loading file.";
  }
}

// =============================================
// CLIPBOARD - copy button with feedback
// =============================================
function copyToClipboard(elementId) {
  const code = document.getElementById(elementId).textContent;
  navigator.clipboard
    .writeText(code)
    .then(() => {
      const button = event.target.closest("button");
      const origNodes = Array.from(button.childNodes).map((n) =>
        n.cloneNode(true),
      );
      button.textContent = "";
      const icon = document.createElement("i");
      icon.className = "fas fa-check";
      icon.setAttribute("aria-hidden", "true");
      button.appendChild(icon);
      button.appendChild(document.createTextNode(" Copied!"));
      button.style.background = "rgba(16,185,129,.16)";
      button.style.borderColor = "rgba(16,185,129,.45)";
      button.style.color = "#6ee7b7";
      setTimeout(() => {
        button.textContent = "";
        origNodes.forEach((n) => button.appendChild(n));
        button.style.background = "";
        button.style.borderColor = "";
        button.style.color = "";
      }, 2000);
    })
    .catch((err) => console.error("Could not copy:", err));
}

// =============================================
// TYPING ANIMATION (intro chapter)
// =============================================
const typingEl = document.querySelector(".typing-text");
const phrases = [
  "Full Stack Developer",
  "DevOps Engineer",
  "Network Administrator",
];
let pIdx = 0,
  cIdx = 0,
  deleting = false;

function typeEffect() {
  if (!typingEl) return;
  const phrase = phrases[pIdx];
  if (!deleting) {
    typingEl.textContent = phrase.substring(0, cIdx + 1);
    cIdx++;
    if (cIdx === phrase.length) {
      deleting = true;
      return setTimeout(typeEffect, 1400);
    }
  } else {
    typingEl.textContent = phrase.substring(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      return setTimeout(typeEffect, 350);
    }
  }
  setTimeout(typeEffect, deleting ? 42 : 88);
}

// =============================================
// SCROLL REVEAL (flat sections: utilities)
// =============================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || "0");
      entry.target.style.setProperty("--reveal-delay", delay + "ms");
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
);
document
  .querySelectorAll("[data-reveal]")
  .forEach((el) => revealObserver.observe(el));

// =============================================
// MAGNETIC BUTTONS
// =============================================
if (!reduceMotion) {
  document.querySelectorAll(".btn-magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.24;
      const y = (e.clientY - r.top - r.height / 2) * 0.24;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transition = "transform 0.45s cubic-bezier(0.16,1,0.3,1)";
      btn.style.transform = "";
      setTimeout(() => {
        btn.style.transition = "";
      }, 450);
    });
  });
}

// =============================================
// AURORA PARALLAX (lerped rAF loop)
// =============================================
const blobs = document.querySelectorAll(".aurora__blob");
if (!reduceMotion && blobs.length) {
  let tx = 0,
    ty = 0,
    cx = 0,
    cy = 0;
  document.addEventListener(
    "mousemove",
    (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    },
    { passive: true },
  );
  (function blobLoop() {
    cx += (tx - cx) * 0.04;
    cy += (ty - cy) * 0.04;
    blobs.forEach((blob, i) => {
      const d = (i + 1) * 34;
      blob.style.translate = `${cx * d}px ${cy * d}px`;
    });
    requestAnimationFrame(blobLoop);
  })();
}

// =============================================
// THE JOURNEY - scroll-scrubbed prism + synced chapters
// =============================================
const journey = document.querySelector(".journey");
const navChapterLinks = Array.from(
  document.querySelectorAll(".nav__link[data-chapter]"),
);
let goToChapter = null;
let updateJourney = null;

(function initJourney() {
  if (!journey) return;

  const object = journey.querySelector(".object");
  const faces = Array.from(journey.querySelectorAll(".object__face"));
  const chapters = Array.from(journey.querySelectorAll(".chapter"));
  const dots = Array.from(journey.querySelectorAll(".rail__dot"));
  const steps = chapters.length - 1;

  // Reduced motion: drop the pin + rotation, stack chapters as a normal page.
  if (reduceMotion || !object || steps < 1) {
    journey.classList.add("journey--static");
    goToChapter = (i) =>
      chapters[clamp(i, 0, steps)]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    return;
  }

  let targetRot = 0;
  let curRot = 0;
  let lastIdx = -1;

  function setActive(idx) {
    if (idx === lastIdx) return;
    lastIdx = idx;
    faces.forEach((f, k) => f.classList.toggle("is-active", k === idx));
    chapters.forEach((c, k) => c.classList.toggle("is-active", k === idx));
    dots.forEach((d, k) => d.classList.toggle("is-active", k === idx));
    navChapterLinks.forEach((link) =>
      link.classList.toggle("is-active", +link.dataset.chapter === idx),
    );
  }

  updateJourney = function (y) {
    const total = journey.offsetHeight - window.innerHeight;
    const p = total > 0 ? clamp((y - journey.offsetTop) / total, 0, 1) : 0;
    const idx = clamp(Math.round(p * steps), 0, steps);
    targetRot = -idx * 60;
    setActive(idx);
  };

  goToChapter = function (i) {
    const total = journey.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: journey.offsetTop + (clamp(i, 0, steps) / steps) * total,
      behavior: "smooth",
    });
  };

  (function spin() {
    curRot += (targetRot - curRot) * 0.14;
    object.style.transform = `perspective(2200px) rotateY(${curRot.toFixed(2)}deg)`;
    requestAnimationFrame(spin);
  })();

  updateJourney(window.scrollY);
})();

// =============================================
// SCROLL - drive chapter rotation
// =============================================
const nav = document.querySelector(".nav");
let scrollTicking = false;

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        nav?.classList.toggle("scrolled", y > 40);
        if (updateJourney) updateJourney(y);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  },
  { passive: true },
);

// =============================================
// NAVIGATION - chapter jumps + smooth anchors + mobile toggle
// =============================================
const navLinksEl = document.querySelector(".nav__links");
const navToggle = document.querySelector(".nav__toggle");

function closeMobileNav() {
  navLinksEl?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
}

// Chapter jumps (nav links, logo, rail dots, in-chapter CTAs)
document.querySelectorAll("[data-chapter]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    if (goToChapter) goToChapter(+el.dataset.chapter);
    closeMobileNav();
  });
});

// Plain anchor links (e.g. Utilities, footer) - smooth scroll
document.querySelectorAll('a[href^="#"]:not([data-chapter])').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMobileNav();
  });
});

navToggle?.addEventListener("click", () => {
  const open = navLinksEl.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

// =============================================
// INIT
// =============================================
window.addEventListener("DOMContentLoaded", () => {
  loadFileContent("nano", "sshNanoCode");
  loadFileContent("backup", "sshBackupCode");
  Prism.highlightElement(document.getElementById("windowsRepairCode"));

  setTimeout(typeEffect, 900);
});
