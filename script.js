// --- Wyłączenie automatycznego przywracania pozycji scrolla ---
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// --- 0. INICJALIZACJA LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
  duration: 1.2,
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
    const walkAndSplit = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim() && text !== " ") return;

        const fragment = document.createDocumentFragment();
        [...text].forEach(char => {
          const span = document.createElement("span");
          span.style.display = "inline-block";
          span.innerHTML = char === " " ? "&nbsp;" : char;
          fragment.appendChild(span);
        });
        node.replaceWith(fragment);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walkAndSplit);
      }
    };

    Array.from(el.childNodes).forEach(walkAndSplit);
  });
}

// Sprawdzamy szerokość ekranu (SplitText & Stagger działają od 768px)
const isDesktop = window.innerWidth >= 768;

if (isDesktop) {
  splitTextIntoSpans(".title");
  splitTextIntoSpans(".subtitle");
}

// --- 1. ANIMACJA WEJŚCIOWA (HERO LOAD) ---
const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

masterTl
  .from(".navbar", { y: -50, opacity: 0, duration: 1 })
  .from(".logo", { x: -20, opacity: 0, duration: 0.6 }, "-=0.5")
  .from(".nav-links a", { y: -20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.4");

if (isDesktop) {
  masterTl
    .from(".title span", { y: 50, opacity: 0, rotateX: -90, duration: 0.8, stagger: 0.02 }, "-=0.2")
    .from(".subtitle span", { y: 20, opacity: 0, duration: 0.5, stagger: 0.01 }, "-=0.4");
} else {
  masterTl
    .from(".title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.2")
    .from(".subtitle", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");
}

masterTl
  .from(".scroll-wrapper .arrow", { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.2")
  .to(".arrow", { y: 15, opacity: 0.4, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

// --- 2. GSAP SCROLLTRIGGER (WYGASANIE HERO SEKCJI) ---
const heroFadeTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-wrapper",
    start: "top top",
    end: "60% top",
    scrub: true,
    invalidateOnRefresh: true
  }
});

if (isDesktop) {
  heroFadeTl
    .to(".title span", { y: -50, opacity: 0, stagger: 0.02, ease: "power1.in" }, 0)
    .to(".subtitle span", { y: -30, opacity: 0, stagger: 0.01, ease: "power1.in" }, 0.1);
} else {
  heroFadeTl
    .to(".title", { y: -30, opacity: 0, ease: "power1.in" }, 0)
    .to(".subtitle", { y: -20, opacity: 0, ease: "power1.in" }, 0.1);
}

heroFadeTl.to(".scroll-wrapper .arrow", { opacity: 0, scale: 0.1, ease: "power1.in" }, 0.2);

// --- 3. ANIMACJA HORIZONTAL SCROLL + PARALAKSA ---
const containerVideos = document.querySelector(".container-videos");
let projectsScrollTrigger;

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
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        projectsScrollTrigger = self;
      }
    }
  });

  const videoItems = document.querySelectorAll(".video-item");
  
  videoItems.forEach((item) => {
    const video = item.querySelector(".gallery-video");
    const text = item.querySelector(".video-content");

    if (video) {
      gsap.fromTo(
        video,
        { xPercent: -10, scale: 1.1 },
        {
          xPercent: 10,
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
        { xPercent: 15 },
        {
          xPercent: -15,
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

// --- 4. MENU HAMBURGER & SCROLL ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a, .arrow');

const closeMenu = () => {
  if (hamburger && navLinks) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    lenis.start();
  }
};

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');

    if (isActive) {
      lenis.stop();
      gsap.fromTo(".nav-links a", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, delay: 0.1 }
      );
    } else {
      lenis.start();
    }
  });
}

navItems.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      closeMenu();
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        if (targetId === "#projects" && projectsScrollTrigger) {
          lenis.scrollTo(projectsScrollTrigger.start);
        } else {
          lenis.scrollTo(targetElement);
        }
      }
    }
  });
});

// --- 5. AUTOPLAY WIDEO ---
const allVideos = document.querySelectorAll('video');

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.play().catch(err => console.warn("Autoplay blocked:", err));
    } else {
      entry.target.pause();
    }
  });
}, { threshold: 0.2 });

allVideos.forEach(video => {
  video.muted = true;
  videoObserver.observe(video);
});

// --- 6. ANIMACJA SEKCJI "PROJEKTY" (Pojawianie tytułu) ---
const projectsTitle = document.querySelector(".projects-title");

if (projectsTitle) {
  gsap.fromTo(projectsTitle, 
    { 
      scale: 0.8, 
      opacity: 0 
    },
    {
      scale: 1,
      opacity: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".projects-title-wrapper",
        start: "top 80%", 
        end: "center center",
        scrub: true
      }
    }
  );
}

// --- 7. FULLSCREEN STACKING CARDS ANIMATION ---
const cards = gsap.utils.toArray(".project-card");

cards.forEach((card, i) => {
  if (i < cards.length - 1) {
    ScrollTrigger.create({
      trigger: card,
      start: "top top",
      pin: true,
      pinSpacing: false,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    });

    gsap.to(card, {
      scale: 0.95,
      ease: "none",
      scrollTrigger: {
        trigger: cards[i + 1],
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  }
});

// --- 8. ODŚWIEŻANIE SCROLLTRIGGERA PO ZAŁADOWANIU ---
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  if (lenis) lenis.scrollTo(0, { immediate: true });
  ScrollTrigger.refresh();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});