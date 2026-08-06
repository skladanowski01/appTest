// --- 0. INICJALIZACJA LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2,
});

// Integracja Lenisa z GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Rejestracja wtyczki ScrollTrigger dla GSAP
gsap.registerPlugin(ScrollTrigger);

// --- POMOCNICZA FUNKCJA: SplitText (z zachowaniem klas HTML, np. .span-title) ---
function splitTextIntoSpans(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    const childNodes = Array.from(el.childNodes);
    el.innerHTML = ""; // Czyszczenie rodzica

    childNodes.forEach(node => {
      // 1. Zwykły tekst
      if (node.nodeType === Node.TEXT_NODE) {
        [...node.textContent].forEach(char => {
          const span = document.createElement("span");
          span.style.display = "inline-block";
          span.innerHTML = char === " " ? "&nbsp;" : char;
          el.appendChild(span);
        });
      } 
      // 2. Element z klasą (np. <span class="span-title">)
      else if (node.nodeType === Node.ELEMENT_NODE) {
        const text = node.innerText;
        node.innerHTML = ""; 

        [...text].forEach(char => {
          const span = document.createElement("span");
          span.style.display = "inline-block";
          span.innerHTML = char === " " ? "&nbsp;" : char;
          node.appendChild(span);
        });

        el.appendChild(node);
      }
    });
  });
}

// Rozbijamy tytuł i podtytuł na pojedyncze litery
splitTextIntoSpans(".title");
splitTextIntoSpans(".subtitle");

// --- 1. ANIMACJA WEJŚCIOWA ---
const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

masterTl
  .from(".navbar", {
    y: -50,
    opacity: 0,
    duration: 1
  })
  .from(".logo", {
    x: -20,
    opacity: 0,
    duration: 0.6
  }, "-=0.5")
  .from(".nav-links a", {
    y: -20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1
  }, "-=0.4")
  .from(".title span", {
    y: 50,
    opacity: 0,
    rotateX: -90,
    duration: 0.8,
    stagger: 0.03
  }, "-=0.2")
  .from(".subtitle span", {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.02
  }, "-=0.4")
  .from(".arrow", {
    scale: 0,  
    opacity: 0,
    duration: 0.8,  
    ease: "back.out(1.7)"
  }, "-=0.2")
  .to(".arrow", {
    y: 15,
    opacity: 0.4,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

// --- 2. SCROLLTRIGGER (ZAKRYWANIE TEKSTU) ---
const heroScrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-wrapper",
    start: "top top",
    end: "bottom top",
    scrub: 1
  }
});

heroScrollTl.to(".container", {
  opacity: 0,
  y: -60,
  ease: "power1.inOut"
});

// --- 3. OBSŁUGA MENU HAMBURGERA I PRZEWIJANIA ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

const closeMenu = () => {
  hamburger.classList.remove('active');
  navLinks.classList.remove('active');
};

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

// Zamykanie menu po kliknięciu w link + płynny scroll
navItems.forEach(link => {
  link.addEventListener('click', (e) => {
    closeMenu();
    
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        lenis.scrollTo(targetElement);
      }
    }
  });
});

// --- 4. AUTOPLAY WIDEO DLA MOBILNYCH ---
const heroVideo = document.querySelector('.bg-video');

if (heroVideo) {
  heroVideo.muted = true;
  const playPromise = heroVideo.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn("Autoplay zablokowany przez przeglądarkę mobilną:", error);
    });
  }
}