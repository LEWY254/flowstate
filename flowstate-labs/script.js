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

// Signup form — no backend yet, so just confirm locally
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.closest(".updates-inner").classList.add("is-signed-up");
});
