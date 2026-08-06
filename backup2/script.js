// --- ANIMACJA LOGO I LINKÓW Z GSAP ---
const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

// 1. Wejście Navbara
masterTl.from(".navbar", {
  y: -50,
  opacity: 0,
  duration: 1
})
// 2. Wejście nagłówka
.from(".title", {
  y: -30,
  opacity: 0,
  duration: 0.8
}, "-=0.4")
// 3. Wejście podtytułu
.from(".subtitle", {
  y: 30,
  opacity: 0,
  duration: 0.8
}, "-=0.5")
// 4. Wejście przycisku ze skalowaniem i obrotem
.from(".arrow", {
  scale: 1.2,  
  opacity: 0,
  duration: 3.5,  
  ease: "back.out(1.7)"
}, "-=0.4");


// --- OBSŁUGA HAMBURGERA NA MOBILE ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');

  // Jeśli menu zostało otwarte, dodaj płynne pojawienie się linków GSAP
  if (navLinks.classList.contains('active')) {
    gsap.from(".nav-links a", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
      delay: 0.2
    });
  }
});