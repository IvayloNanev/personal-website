/**
 * Dr. Ethan Nanev - Portfolio Script
 * Handles navigation header styling, mobile navigation, scroll reveals,
 * active link highlighting, and accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollReveals();
  initScrollSpy();
});

/**
 * 1. Header Scroll Effect
 * Adds 'scrolled' class to header when window is scrolled down.
 */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  // Run on load and add listener
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * 2. Mobile Menu Toggle
 * Opens and closes mobile navigation menu with correct ARIA properties.
 */
function initMobileMenu() {
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.getElementById('primary-navigation');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!navToggle || !navMenu) return;
  
  const toggleMenu = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    
    // Toggle classes and ARIA states
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
    
    // Disable body scroll when menu is open
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  };
  
  const closeMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  };
  
  navToggle.addEventListener('click', toggleMenu);
  
  // Close menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu if window is resized above mobile width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  }, { passive: true });
}

/**
 * 3. Intersection Observer Scroll Reveals
 * Uses native IntersectionObserver to animate elements as they enter the viewport.
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  // Configuration options
  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully in view
  };
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Stop observing after animation triggers
      }
    });
  };
  
  const observer = new IntersectionObserver(revealCallback, revealOptions);
  
  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * 4. Active Link Highlight (Scroll Spy)
 * Detects which section is in view and highlights the matching navigation link.
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const spyOptions = {
    threshold: 0.3,
    rootMargin: '-90px 0px -50% 0px' // Offset header height
  };
  
  const spyCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeSectionId = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${activeSectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  
  const observer = new IntersectionObserver(spyCallback, spyOptions);
  
  sections.forEach(section => {
    observer.observe(section);
  });
}
