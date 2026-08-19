const body = document.body;
const header = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");
const navLinks = document.querySelectorAll(".nav-link");
const loadingScreen = document.getElementById("loading-screen");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loadingScreen?.classList.add("is-hidden");
  }, 450);
});

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (!body.classList.contains("nav-open")) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (mainNav?.contains(target) || navToggle?.contains(target)) return;
  body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
});

const revealEls = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
);

revealEls.forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];

const updateActiveNav = () => {
  const offset = window.innerHeight * 0.32;
  const current = sections.reduce((active, section) => {
    return section.offsetTop <= window.scrollY + offset ? section : active;
  }, sections[0]);

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current?.id}`);
  });
};

updateActiveNav();
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("hashchange", updateActiveNav);
window.addEventListener("load", () => window.setTimeout(updateActiveNav, 120));

const typewriter = document.getElementById("typewriter");
const words = ["tatuajes personalizados", "diseños privados", "micropigmentación de labios", "cuidado facial profundo"];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const typeLoop = () => {
  if (!typewriter) return;
  const current = words[wordIndex];
  typewriter.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    window.setTimeout(typeLoop, 70);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    window.setTimeout(typeLoop, 1350);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    window.setTimeout(typeLoop, 38);
    return;
  }

  deleting = false;
  wordIndex = (wordIndex + 1) % words.length;
  window.setTimeout(typeLoop, 260);
};

typeLoop();

const canvas = document.getElementById("particles-canvas");
const ctx = canvas?.getContext("2d");
let particles = [];
let animationFrame;

const createParticles = () => {
  if (!canvas) return;
  const count = window.innerWidth < 700 ? 28 : 58;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.8 + 0.5,
    speedX: (Math.random() - 0.5) * 0.22,
    speedY: Math.random() * 0.3 + 0.08,
    alpha: Math.random() * 0.45 + 0.1
  }));
};

const resizeCanvas = () => {
  if (!canvas) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles();
};

const drawParticles = () => {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.y > window.innerHeight) particle.y = -10;
    if (particle.x < -10) particle.x = window.innerWidth + 10;
    if (particle.x > window.innerWidth + 10) particle.x = -10;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(227, 38, 61, ${particle.alpha})`;
    ctx.fill();
  });
  animationFrame = window.requestAnimationFrame(drawParticles);
};

if (canvas && ctx) {
  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      drawParticles();
    }
  });
}
