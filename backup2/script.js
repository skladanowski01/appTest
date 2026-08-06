// Rejestracja wtyczki ScrollTrigger dla GSAP
gsap.registerPlugin(ScrollTrigger);

// --- POMOCNICZA FUNKCJA: SplitText (rozbijanie tekstu na litery) ---
function splitTextIntoSpans(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    const text = el.innerText;
    el.innerHTML = ""; // Czyszczenie oryginalnego tekstu
    
    // Rozbijanie na poszczególne litery
    [...text].forEach(char => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      // Jeśli znak to spacja, zamieniamy na twardą spację, aby nie zepsuć odstępów
      span.innerHTML = char === " " ? "&nbsp;" : char;
      el.appendChild(span);
    });
  });
}

// Rozbijamy tytuł i podtytuł na pojedyncze litery
splitTextIntoSpans(".title");
splitTextIntoSpans(".subtitle");


// --- 1. ANIMACJA WEJŚCIOWA Z EFEKTEM STAGGER DLA LITER ---
const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

masterTl
  // Pasek nawigacji wjeżdża z góry
  .from(".navbar", {
    y: -50,
    opacity: 0,
    duration: 1
  })
  // Logo
  .from(".logo", {
    x: -20,
    opacity: 0,
    duration: 0.6
  }, "-=0.5")
  // Stagger dla linków nawigacji
  .from(".nav-links a", {
    y: -20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1
  }, "-=0.4")
  
  // EFEKT STAGGER NA LITERACH TYTUŁU ("Emocje to Design.")
  .from(".title span", {
    y: 50,
    opacity: 0,
    rotateX: -90, // Efekt obrotu 3D dla liter
    duration: 0.8,
    stagger: 0.03 // Bardzo szybki stagger dla każdej litery
  }, "-=0.2")

  // EFEKT STAGGER NA LITERACH PODTYTUŁU ("Tworzę animacje www.")
  .from(".subtitle span", {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.02
  }, "-=0.4")

  // Pojawienie się strzałki
  .from(".arrow", {
    scale: 0,  
    opacity: 0,
    duration: 0.8,  
    ease: "back.out(1.7)"
  }, "-=0.2")
  
  // Wolno pulsująca strzałka w dół po załadowaniu
  .to(".arrow", {
    y: 15,
    opacity: 0.4,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });


// --- 2. ZNIKANIE TEKSTU PODCZAS SCROLLOWANIA (ScrollTrigger) ---
const heroScrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-wrapper",
    start: "top top",
    end: "bottom top",
    scrub: 1
  }
});

// Zanikanie kontenera wraz z literami podczas przewijania w dół
heroScrollTl.to(".container", {
  opacity: 0,
  y: -60,
  ease: "power1.inOut"
});


// --- 3. OBSŁUGA MENU HAMBURGERA ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');

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