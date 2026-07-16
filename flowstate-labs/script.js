// Frosted nav appears once the page starts scrolling
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal-on-scroll with a slight stagger (delays live in CSS)
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Light/dark toggle, persisted across visits
document.getElementById("theme-toggle").addEventListener("click", () => {
  const html = document.documentElement;
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  localStorage.setItem("theme", next);
  if (typeof flow !== "undefined") flow.recolor();
});

// ---- Hero particle field: drifting dots with proximity links ----
const flow = (() => {
  const canvas = document.getElementById("flow");
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LINK_DIST = 120;
  let w = 0, h = 0, dpr = 1, raf = null;
  let line = "68,60,54", accent = "234,88,12";
  let dots = [];

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    line = cs.getPropertyValue("--canvas-line").trim() || line;
    accent = cs.getPropertyValue("--canvas-accent").trim() || accent;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedDots();
  }

  function seedDots() {
    const count = Math.min(90, Math.round((w * h) / 16000));
    dots = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      isAccent: i % 11 === 5,
    }));
  }

  function paint(move) {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      if (move) {
        d.x = (d.x + d.vx + w) % w;
        d.y = (d.y + d.vy + h) % h;
      }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.isAccent ? 2.2 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.isAccent ? accent : line},${d.isAccent ? 0.65 : 0.4})`;
      ctx.fill();
    }
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(${line},${0.14 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    paint(true);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    readColors();
    resize();
    if (reduced) { paint(false); return; }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  window.addEventListener("resize", start);
  start();

  return {
    recolor() {
      readColors();
      if (reduced) paint(false);
    },
  };
})();

// Signup form — no backend yet, so just confirm locally
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.closest(".updates-inner").classList.add("is-signed-up");
});
