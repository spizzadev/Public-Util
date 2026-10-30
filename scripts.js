// =============================================
// PREFERENCES
// =============================================
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const canHover = window.matchMedia("(hover: hover)").matches;

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

// Chapter slugs for shareable deep links (#about, #skills, ...).
// Index matches data-ch / data-chapter.
const CHAPTER_SLUGS = ["home", "about", "skills", "projects", "contact", "utilities"];

// =============================================
// FILE LOADING - SSH keys
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
// MAGNETIC BUTTONS (pointer devices only)
// =============================================
if (!reduceMotion && canHover) {
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
// AURORA PARALLAX (lerped rAF loop, paused when hidden)
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
    if (!document.hidden) {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      blobs.forEach((blob, i) => {
        const d = (i + 1) * 34;
        blob.style.translate = `${cx * d}px ${cy * d}px`;
      });
    }
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
let activeChapter = 0;

(function initJourney() {
  if (!journey) return;

  const object = journey.querySelector(".object");
  const faces = Array.from(journey.querySelectorAll(".object__face"));
  const chapters = Array.from(journey.querySelectorAll(".chapter"));
  const dots = Array.from(journey.querySelectorAll(".rail__dot"));
  const steps = chapters.length - 1;

  function setActive(idx) {
    activeChapter = idx;
    faces.forEach((f, k) => f.classList.toggle("is-active", k === idx));
    chapters.forEach((c, k) => c.classList.toggle("is-active", k === idx));
    dots.forEach((d, k) => d.classList.toggle("is-active", k === idx));
    navChapterLinks.forEach((link) =>
      link.classList.toggle("is-active", +link.dataset.chapter === idx),
    );
  }

  // Reduced motion: drop the pin + rotation, stack chapters as a normal page.
  if (reduceMotion || !object || steps < 1) {
    journey.classList.add("journey--static");
    goToChapter = (i, smooth = true) => {
      const el = chapters[clamp(i, 0, steps)];
      if (!el) return;
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
      setActive(clamp(i, 0, steps));
    };
    return;
  }

  let targetRot = 0;
  let curRot = 0;
  let lastIdx = -1;

  const innerSetActive = setActive;
  setActive = function (idx) {
    if (idx === lastIdx) return;
    lastIdx = idx;
    innerSetActive(idx);
  };

  updateJourney = function (y) {
    const total = journey.offsetHeight - window.innerHeight;
    const p = total > 0 ? clamp((y - journey.offsetTop) / total, 0, 1) : 0;
    const idx = clamp(Math.round(p * steps), 0, steps);
    targetRot = -idx * 60;
    setActive(idx);
  };

  goToChapter = function (i, smooth = true) {
    const total = journey.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: journey.offsetTop + (clamp(i, 0, steps) / steps) * total,
      behavior: smooth && !reduceMotion ? "smooth" : "auto",
    });
  };

  (function spin() {
    if (!document.hidden) {
      curRot += (targetRot - curRot) * 0.14;
      object.style.transform = `perspective(2200px) rotateY(${curRot.toFixed(2)}deg)`;
    }
    requestAnimationFrame(spin);
  })();

  updateJourney(window.scrollY);
})();

// =============================================
// DEEP LINKS - hash <-> chapter routing
// =============================================
function chapterFromHash() {
  const slug = location.hash.replace(/^#/, "");
  if (!slug) return null;
  const i = CHAPTER_SLUGS.indexOf(slug);
  return i >= 0 ? i : null;
}

window.addEventListener("hashchange", () => {
  const idx = chapterFromHash();
  if (idx !== null && idx !== activeChapter && goToChapter) {
    goToChapter(idx);
  }
});

// =============================================
// SCROLL - drive chapter rotation
// =============================================
const nav = document.querySelector(".nav");
let scrollTicking = false;

// Keep the URL in sync for deep links, but only once a hash exists
// (replaceState: scrolling must not spam history, clean URLs stay clean,
// and a deep-link hash is never clobbered before the initial jump).
function syncHash() {
  const slug = "#" + CHAPTER_SLUGS[activeChapter];
  if (location.hash && location.hash !== slug) history.replaceState(null, "", slug);
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        nav?.classList.toggle("scrolled", y > 40);
        if (updateJourney) updateJourney(y);
        syncHash();
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
    const idx = +el.dataset.chapter;
    if (goToChapter) goToChapter(idx);
    const slug = "#" + CHAPTER_SLUGS[idx];
    if (location.hash !== slug) history.pushState(null, "", slug);
    closeMobileNav();
  });
});

// Plain anchor links (e.g. skip link) - smooth scroll
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
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  loadFileContent("ssh", "sshCode");

  if (reduceMotion && typingEl) {
    typingEl.textContent = phrases[0];
  } else {
    setTimeout(typeEffect, 900);
  }

  // Deep link on load: jump straight to the requested chapter.
  const idx = chapterFromHash();
  if (idx && idx !== 0) {
    requestAnimationFrame(() => {
      goToChapter && goToChapter(idx, false);
    });
  }
});
