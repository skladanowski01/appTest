// --- Wyłączenie automatycznego przywracania pozycji scrolla ---
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// --- 0. INICJALIZACJA LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
  duration: 2.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger);

// --- POMOCNICZA FUNKCJA: SplitText ---
function splitTextIntoSpans(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    const childNodes = Array.from(el.childNodes);
    el.innerHTML = "";

    childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        [...node.textContent].forEach(char => {
          const span = document.createElement("span");
          span.style.display = "inline-block";
          span.innerHTML = char === " " ? "&nbsp;" : char;
          el.appendChild(span);
        });
      } 
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

splitTextIntoSpans(".title");
splitTextIntoSpans(".subtitle");

// --- 1. ANIMACJA WEJŚCIOWA (HERO LOAD) ---
const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

masterTl
  .from(".navbar", { y: -50, opacity: 0, duration: 1 })
  .from(".logo", { x: -20, opacity: 0, duration: 0.6 }, "-=0.5")
  .from(".nav-links a", { y: -20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.4")
  .from(".title span", { y: 50, opacity: 0, rotateX: -90, duration: 0.8, stagger: 0.03 }, "-=0.2")
  .from(".subtitle span", { y: 20, opacity: 0, duration: 0.5, stagger: 0.02 }, "-=0.4")
  .from(".arrow", { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.2")
  .to(".arrow", { y: 15, opacity: 0.4, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

// --- 2. GSAP SCROLLTRIGGER (WOLNIEJSZY, BARDZIEJ WIDOCZNY STAGGER) ---
gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-wrapper",
    start: "top top",
    end: "40% top",
    scrub: true,
    invalidateOnRefresh: true
  }
})
.to(".title span", {
  y: -50,
  opacity: 0,
  stagger: 0.08,
  ease: "power1.in"
}, 0)
.to(".subtitle span", {
  y: -30,
  opacity: 0,
  stagger: 0.04,
  ease: "power1.in"
}, 0.2)
.to(".arrow", {  
  opacity: 0,
  scale: 0.1,
  ease: "power1.in"
}, 0.4);

// --- 3. ANIMACJA HORIZONTAL SCROLL + EFEKT PARALAKSY ---
const containerVideos = document.querySelector(".container-videos");

if (containerVideos) {
  const horizontalTween = gsap.to(containerVideos, {
    x: () => -(containerVideos.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: ".horizontal-container",
      start: "top top",
      end: () => `+=${containerVideos.scrollWidth - window.innerWidth}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  const videoItems = document.querySelectorAll(".video-item");
  
  videoItems.forEach((item) => {
    const video = item.querySelector(".gallery-video");
    const text = item.querySelector(".video-content");

    if (video) {
      gsap.fromTo(
        video,
        { xPercent: -15, scale: 1.15 },
        {
          xPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            containerAnimation: horizontalTween,
            start: "left right",
            end: "right left",
            scrub: true
          }
        }
      );
    }

    if (text) {
      gsap.fromTo(
        text,
        { xPercent: 10 },
        {
          xPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            containerAnimation: horizontalTween,
            start: "left right",
            end: "right left",
            scrub: true
          }
        }
      );
    }
  });
}

// --- 4. OBSŁUGA MENU HAMBURGERA I SCROLLA ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

const closeMenu = () => {
  if (hamburger && navLinks) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  }
};

if (hamburger) {
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
}

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

// --- 5. AUTOPLAY WIDEO ---
const allVideos = document.querySelectorAll('video');

allVideos.forEach(video => {
  video.muted = true;
  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn("Autoplay zablokowany:", error);
    });
  }
});

// --- 6. PONOWNE PRZELICZENIE PO ZAŁADOWANIU DANYCH ---
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  if (lenis) lenis.scrollTo(0, { immediate: true });
  
  ScrollTrigger.refresh();
});