// =============================================
// PREFERENCES
// =============================================
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// =============================================
// FILE LOADING - SSH public key
// =============================================
async function loadFileContent(filePath, elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  try {
    const response = await fetch(filePath);
    if (!response.ok)
      throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
    const content = await response.text();
    el.textContent = content.trim();
  } catch (err) {
    console.error(err);
    el.textContent = "Error loading file.";
  }
}

// =============================================
// CLIPBOARD - copy button with feedback
// =============================================
function copyToClipboard(elementId, button) {
  const code = document.getElementById(elementId).textContent;
  if (!button) button = document.activeElement;
  const origHtml = button.innerHTML;
  navigator.clipboard
    .writeText(code)
    .then(() => {
      button.innerHTML =
        '<svg class="ic" aria-hidden="true"><use href="#i-check"></use></svg> Copied!';
      button.style.background = "rgba(16,185,129,.16)";
      button.style.borderColor = "rgba(16,185,129,.45)";
      button.style.color = "#6ee7b7";
      setTimeout(() => {
        button.innerHTML = origHtml;
        button.style.background = "";
        button.style.borderColor = "";
        button.style.color = "";
      }, 2000);
    })
    .catch((err) => console.error("Could not copy:", err));
}

// =============================================
// TYPING ANIMATION (hero)
// =============================================
const typingEl = document.querySelector(".typing-text");
const phrases = ["Full Stack Developer", "DevOps Engineer", "Network Administrator"];

function startTyping() {
  if (!typingEl) return;
  if (reduceMotion) {
    typingEl.textContent = phrases[0];
    return;
  }
  let pIdx = 0,
    cIdx = 0,
    deleting = false;
  (function typeEffect() {
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
  })();
}

// =============================================
// REVEAL ON SCROLL - IntersectionObserver only.
// No scroll listeners, no layout reads, no blur filters.
// =============================================
function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty("--reveal-delay", i * 70 + "ms");
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );
  els.forEach((el) => io.observe(el));
}

// =============================================
// SCROLL SPY - active nav link via one observer
// =============================================
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll(".nav__link"));
  const byId = {};
  links.forEach((l) => (byId[l.getAttribute("href").slice(1)] = l));
  const sections = ["home", "about", "skills", "projects", "contact", "utilities"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;

  let active = null;
  function setActive(id) {
    if (active === id) return;
    active = id;
    links.forEach((l) => l.classList.remove("is-active"));
    byId[id]?.classList.add("is-active");
  }

  // "home" is the <main> anchor (top of page)
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
  );
  sections.forEach((s) => spy.observe(s));
}

// =============================================
// NAV - compact when scrolled (class toggle only)
// =============================================
function initNavShrink() {
  const nav = document.querySelector(".nav");
  if (!nav || !("IntersectionObserver" in window)) return;
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:48px;left:0;width:1px;height:1px;pointer-events:none";
  document.body.prepend(sentinel);
  new IntersectionObserver(
    (entries) => nav.classList.toggle("scrolled", !entries[0].isIntersecting),
    { threshold: 0 },
  ).observe(sentinel);
}

// =============================================
// MOBILE NAV TOGGLE
// =============================================
function initMobileNav() {
  const links = document.querySelector(".nav__links");
  const toggle = document.querySelector(".nav__toggle");
  if (!links || !toggle) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// =============================================
// INIT
// =============================================
window.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  loadFileContent("ssh", "sshCode");
  startTyping();
  initReveal();
  initScrollSpy();
  initNavShrink();
  initMobileNav();
});
