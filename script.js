// Rejestracja wtyczki ScrollTrigger dla GSAP
gsap.registerPlugin(ScrollTrigger);

// --- 1. ANIMACJA WEJŚCIOWA (Na start po wczytaniu strony) ---
const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

masterTl
  // Posek nawigacji wjeżdża z góry
  .from(".navbar", {
    y: -50,
    opacity: 0,
    duration: 1
  })
  // Logo pojawia się z przesunięciem
  .from(".logo", {
    x: -20,
    opacity: 0,
    duration: 0.6
  }, "-=0.5")
  // STAGGER DLA LINKÓW NAWIGACJI (pojawiają się kaskadowo po kolei)
  .from(".nav-links a", {
    y: -20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.15
  }, "-=0.4")
  // Tytuł i podtytuł w sekcji Hero
  .from(".title", {
    y: -30,
    opacity: 0,
    duration: 0.8
  }, "-=0.2")
  .from(".subtitle", {
    y: 30,
    opacity: 0,
    duration: 0.8
  }, "-=0.5")
  // Pojawienie się strzałki na start
  .from(".arrow", {
    scale: 0,  
    opacity: 0,
    duration: 0.8,  
    ease: "back.out(1.7)"
  }, "-=0.4")
  // PO WEJŚCIU: Wolno pulsująca / mrugająca strzałka w dół
  .to(".arrow", {
    y: 15,            // Przesunięcie lekko w dół
    opacity: 0.4,     // Efekt mrugania (zmniejszenie widoczności)
    duration: 1.5,    // Wolne tempo
    repeat: -1,       // Nieskończona pętla
    yoyo: true,       // Płynny powrót do pierwotnego stanu
    ease: "sine.inOut"
  });


// --- 2. ZNIKANIE TEKSTU PODCZAS SCROLLOWANIA W DÓŁ (I POWRÓT W GÓRĘ) ---
const heroScrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-wrapper",
    start: "top top",
    end: "bottom top",
    scrub: 1 // Powiązanie ze skrollem (działa automatycznie w dół I W GÓRĘ)
  }
});

// Zmniejszamy przezroczystość elementów Hero i unosimy je w górę przy skrolowaniu
heroScrollTl.to(".container > *", {
  opacity: 0,
  y: -60,
  stagger: 0.1,
  ease: "power1.inOut"
});


// --- 3. OBSŁUGA MENU HAMBURGERA NA MOBILNYCH URZĄDZENIACH ---
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