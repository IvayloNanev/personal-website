/**
 * Dr. Ivaylo Nanev - Portfolio Script
 * Handles navigation header styling, mobile navigation, scroll reveals,
 * active link highlighting, and accessibility.
 */

const viewportUpdateCallbacks = new Set();
let viewportSchedulerBound = false;
let viewportFrameRequested = false;

function registerViewportUpdate(callback) {
  viewportUpdateCallbacks.add(callback);

  if (!viewportSchedulerBound) {
    const dispatchViewportUpdate = () => {
      if (viewportFrameRequested) return;
      viewportFrameRequested = true;

      window.requestAnimationFrame(() => {
        viewportUpdateCallbacks.forEach(update => update());
        viewportFrameRequested = false;
      });
    };

    window.addEventListener('scroll', dispatchViewportUpdate, { passive: true });
    window.addEventListener('resize', dispatchViewportUpdate, { passive: true });
    viewportSchedulerBound = true;
  }
}

function bindPointerSpotlight(element, xProperty, yProperty) {
  let pointerFrame = null;
  let pointerX = 0;
  let pointerY = 0;

  element.addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerFrame !== null) return;

    pointerFrame = window.requestAnimationFrame(() => {
      const bounds = element.getBoundingClientRect();
      element.style.setProperty(xProperty, `${pointerX - bounds.left}px`);
      element.style.setProperty(yProperty, `${pointerY - bounds.top}px`);
      pointerFrame = null;
    });
  }, { passive: true });

  element.addEventListener('pointerleave', () => {
    if (pointerFrame !== null) {
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = null;
    }
    element.style.setProperty(xProperty, '50%');
    element.style.setProperty(yProperty, '50%');
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initSidebarProgress();
  initMobileMenu();
  initScrollReveals();
  initSelectedWorkScrollReveal();
  initScrollSpy();
  initBuilderCards();
  initBringCards();
  initLegacySurfaceSpotlights();
  initCinematicTransition();
  initBuilderToBringTransition();
  initSectionCardExits();
  initSelectedWork();
  initProcessTimeline();
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
  registerViewportUpdate(handleScroll);
}

/**
 * Keeps the editorial rail's page-progress line in sync with the document.
 */
function initSidebarProgress() {
  const rail = document.querySelector('.site-header');
  if (!rail) return;

  let frameRequested = false;
  const updateProgress = () => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    rail.style.setProperty('--page-progress', progress.toFixed(4));
    frameRequested = false;
  };

  const requestUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateProgress);
  };

  updateProgress();
  registerViewportUpdate(updateProgress);
}

/**
 * 2. Mobile Menu Toggle
 * Opens and closes mobile navigation menu with correct ARIA properties.
 */
function initMobileMenu() {
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.getElementById('primary-navigation');
  const navLinks = navMenu.querySelectorAll('a');
  
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
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  };
  
  navToggle.addEventListener('click', () => {
    toggleMenu();
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  
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
  const revealElements = document.querySelectorAll('.scroll-reveal, .builder-reveal, .bring-reveal, .work-reveal, .process-reveal, .capability-reveal, .closing-reveal');
  
  // Configuration options
  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px 12% 0px' // Let the next scene emerge before the previous one leaves
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
    if (!element.classList.contains('work-reveal')) observer.observe(element);
  });
}

/**
 * Scroll-linked Selected Work entrance.
 * Starts before the scene enters fully and reverses naturally with scrolling.
 */
function initSelectedWorkScrollReveal() {
  const section = document.querySelector('.selected-work-section');
  const heading = section?.querySelector('.work-heading');
  const label = section?.querySelector('.editorial-label');
  const lead = section?.querySelector('.work-lead');
  const carousel = section?.querySelector('.work-carousel');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!section || !heading || !lead || !carousel) return;

  const elements = [label, heading, lead, carousel].filter(Boolean);
  if (reduceMotion) {
    elements.forEach(element => element.classList.add('is-visible'));
    return;
  }

  const clamp = value => Math.min(Math.max(value, 0), 1);
  const ease = value => 1 - Math.pow(1 - clamp(value), 3);
  let frameRequested = false;

  const applyProgress = (element, progress, distance) => {
    const eased = ease(progress);
    element.style.opacity = eased.toFixed(3);
    element.style.transform = `translateY(${((1 - eased) * distance).toFixed(2)}px)`;
  };

  const updateReveal = () => {
    const top = section.getBoundingClientRect().top;
    const start = window.innerHeight * 0.92;
    const end = window.innerHeight * 0.68;
    const progress = clamp((start - top) / (start - end));

    if (label) applyProgress(label, progress / 0.32, 16);
    applyProgress(heading, progress / 0.36, 20);
    applyProgress(lead, (progress - 0.05) / 0.4, 20);
    applyProgress(carousel, (progress - 0.1) / 0.5, 24);
    frameRequested = false;
  };

  const requestUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateReveal);
  };

  updateReveal();
  registerViewportUpdate(updateReveal);
}

/**
 * 4. Builder Card Spotlight
 * Tracks pointer position to create a restrained light reflection on each card.
 */
function initBuilderCards() {
  const cards = document.querySelectorAll('.builder-card');

  cards.forEach(card => {
    bindPointerSpotlight(card, '--spot-x', '--spot-y');
  });
}

/**
 * 5. What I Bring Card Spotlight
 * Creates a soft internal reflection that follows the pointer.
 */
function initBringCards() {
  const cards = document.querySelectorAll('.bring-card');

  cards.forEach(card => {
    bindPointerSpotlight(card, '--bring-x', '--bring-y');
  });
}

/**
 * 6. Shared Surface Spotlights
 * Extends the same pointer-lit response to older card-like surfaces.
 */
function initLegacySurfaceSpotlights() {
  const surfaces = document.querySelectorAll('.capability-card, .availability-card');

  surfaces.forEach(surface => {
    bindPointerSpotlight(surface, '--surface-x', '--surface-y');
  });
}

/**
 * 7. Hero-to-Builder Transition
 * Gently recedes the opening title as the next chapter enters the viewport.
 */
function initCinematicTransition() {
  const hero = document.querySelector('.hero-section');

  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let frameRequested = false;

  const updateTransition = () => {
    const bounds = hero.getBoundingClientRect();
    const fadeDistance = Math.max(bounds.height * 0.52, 320);
    const progress = Math.min(Math.max(-bounds.top / fadeDistance, 0), 1);

    hero.style.setProperty('--hero-exit', progress.toFixed(3));
    frameRequested = false;
  };

  const requestUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateTransition);
  };

  updateTransition();
  registerViewportUpdate(updateTransition);
}

/**
 * 7. Builder-to-Bring Transition
 * Crossfades adjacent chapters so they briefly share the viewport.
 */
function initBuilderToBringTransition() {
  const builder = document.querySelector('.builder-section');
  const bring = document.querySelector('.bring-section');

  if (!builder || !bring || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let frameRequested = false;

  const updateTransition = () => {
    const bringTop = bring.getBoundingClientRect().top;
    const fadeStart = window.innerHeight * 0.96;
    const fadeEnd = window.innerHeight * 0.4;
    const progress = Math.min(Math.max((fadeStart - bringTop) / (fadeStart - fadeEnd), 0), 1);

    builder.style.setProperty('--builder-exit', progress.toFixed(3));
    frameRequested = false;
  };

  const requestUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateTransition);
  };

  updateTransition();
  registerViewportUpdate(updateTransition);
}

/**
 * 8. Card Group Scroll Exits
 * Carries the Builder's fade-and-lift exit through each later scene.
 */
function initSectionCardExits() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const transitions = [
    { source: document.querySelector('.bring-grid'), target: document.querySelector('.selected-work-section') },
    { source: document.querySelector('.work-carousel'), target: document.querySelector('.process-section') },
    { source: document.querySelector('.process-timeline'), target: document.querySelector('.skills-section') },
    { source: document.querySelector('.capabilities-grid'), target: document.querySelector('.contact-section') }
  ].filter(item => item.source && item.target);

  if (!transitions.length) return;

  let frameRequested = false;

  const updateExits = () => {
    const fadeStart = window.innerHeight * 0.94;
    const fadeEnd = window.innerHeight * 0.42;

    transitions.forEach(({ source, target }) => {
      const targetTop = target.getBoundingClientRect().top;
      const progress = Math.min(Math.max((fadeStart - targetTop) / (fadeStart - fadeEnd), 0), 1);
      source.style.setProperty('--section-exit', progress.toFixed(3));
    });

    frameRequested = false;
  };

  const requestUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateExits);
  };

  updateExits();
  registerViewportUpdate(updateExits);
}

/**
 * 9. Process Timeline
 * Illuminates the process journey as it moves through the viewport.
 */
function initProcessTimeline() {
  const timeline = document.querySelector('.process-timeline');
  const stages = Array.from(document.querySelectorAll('.process-stage'));

  if (!timeline || !stages.length) return;

  const showProgressFor = index => {
    stages[0].classList.remove('is-preview');
    const progress = stages.length > 1 ? index / (stages.length - 1) : 1;
    timeline.style.setProperty('--process-progress', progress.toFixed(3));
  };

  const resetProgress = () => {
    timeline.style.setProperty('--process-progress', '0');
    stages[0].classList.add('is-preview');
  };

  stages.forEach((stage, index) => {
    stage.addEventListener('pointerenter', () => showProgressFor(index));
    stage.addEventListener('focus', () => showProgressFor(index));
  });

  timeline.addEventListener('pointerleave', resetProgress);
  timeline.addEventListener('focusout', event => {
    if (!timeline.contains(event.relatedTarget) && !timeline.matches(':hover')) resetProgress();
  });

  resetProgress();
}

/**
 * 10. Selected Work Motion
 * Initializes the pre-rendered, compositor-driven project carousel.
 */
function initSelectedWork() {
  const carousel = document.querySelector('.work-carousel');
  const track = document.querySelector('.work-track');
  const realSlides = Array.from(document.querySelectorAll('.work-slide'));
  const progressItems = Array.from(document.querySelectorAll('.work-progress span'));
  const statusCurrent = document.querySelector('.work-status span');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!carousel || !track || !realSlides.length) return;

  realSlides.forEach((slide, index) => {
    slide.dataset.projectIndex = String(index);
    const image = slide.querySelector('img');
    image?.classList.add('is-decoding');
  });

  const firstClone = realSlides[0].cloneNode(true);
  const lastClone = realSlides[realSlides.length - 1].cloneNode(true);
  firstClone.dataset.clone = 'first';
  lastClone.dataset.clone = 'last';
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  firstClone.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
  lastClone.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
  track.prepend(lastClone);
  track.append(firstClone);

  const slides = Array.from(track.querySelectorAll('.work-slide'));
  const projectImages = Array.from(track.querySelectorAll('.project-image'));

  projectImages.forEach(image => {
    const revealDecodedImage = () => {
      image.classList.remove('is-decoding');
      image.classList.add('is-decoded');
    };

    if (image.decode) {
      image.decode().then(revealDecodedImage).catch(revealDecodedImage);
    } else if (image.complete) {
      revealDecodedImage();
    } else {
      image.addEventListener('load', revealDecodedImage, { once: true });
      image.addEventListener('error', revealDecodedImage, { once: true });
    }
  });
  let activePhysicalIndex = 1;
  let currentX = 0;
  let velocity = 0;
  let animationFrame = null;
  let snapTarget = null;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartPosition = 0;
  let lastPointerX = 0;
  let dragDistance = 0;
  let activePointerId = null;

  slides.forEach(slide => {
    bindPointerSpotlight(slide, '--slide-x', '--slide-y');
  });

  const positionFor = index => {
    const slide = slides[index];
    return carousel.clientWidth / 2 - (slide.offsetLeft + slide.offsetWidth / 2);
  };

  const render = () => {
    track.style.setProperty('--track-x', `${currentX.toFixed(2)}px`);
  };

  const realIndexFor = physicalIndex => {
    const projectIndex = Number(slides[physicalIndex]?.dataset.projectIndex);
    return Number.isInteger(projectIndex) ? projectIndex : 0;
  };

  const updateSlideState = physicalIndex => {
    activePhysicalIndex = physicalIndex;
    const activeRealIndex = realIndexFor(physicalIndex);

    slides.forEach((slide, index) => {
      const isActive = index === physicalIndex;
      slide.classList.toggle('is-active', isActive);
      const isClone = Boolean(slide.dataset.clone);
      slide.setAttribute('aria-hidden', String(!isActive || isClone));

      const caseStudyLink = slide.querySelector('.work-button');
      if (caseStudyLink) caseStudyLink.tabIndex = isActive && !isClone ? 0 : -1;
    });

    progressItems.forEach((item, index) => {
      item.classList.toggle('is-active', index === activeRealIndex);
    });

    if (statusCurrent) statusCurrent.textContent = String(activeRealIndex + 1).padStart(2, '0');
  };

  const nearestSlideIndex = () => {
    const viewportCenter = carousel.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const center = currentX + slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(center - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const normalizeClone = () => {
    if (activePhysicalIndex === 0) {
      activePhysicalIndex = realSlides.length;
      currentX = positionFor(activePhysicalIndex);
    } else if (activePhysicalIndex === slides.length - 1) {
      activePhysicalIndex = 1;
      currentX = positionFor(activePhysicalIndex);
    }
    updateSlideState(activePhysicalIndex);
    render();
  };

  const beginSnap = (index = nearestSlideIndex()) => {
    activePhysicalIndex = Math.min(Math.max(index, 0), slides.length - 1);
    snapTarget = positionFor(activePhysicalIndex);

    if (reduceMotion) {
      currentX = snapTarget;
      velocity = 0;
      snapTarget = null;
      render();
      normalizeClone();
    }
  };

  const animate = () => {
    if (isDragging) {
      animationFrame = null;
      return;
    }

    if (snapTarget !== null) {
      const distance = snapTarget - currentX;
      velocity = velocity * 0.7 + distance * 0.11;
      currentX += velocity;

      const visuallyCenteredIndex = nearestSlideIndex();
      if (visuallyCenteredIndex !== activePhysicalIndex) updateSlideState(visuallyCenteredIndex);

      if (Math.abs(distance) < 0.5 && Math.abs(velocity) < 0.2) {
        currentX = snapTarget;
        velocity = 0;
        snapTarget = null;
        render();
        normalizeClone();
        animationFrame = null;
        return;
      }
    } else {
      currentX += velocity;
      velocity *= 0.94;
      const minimumX = positionFor(slides.length - 1) - 120;
      const maximumX = positionFor(0) + 120;
      currentX = Math.min(Math.max(currentX, minimumX), maximumX);

      const nearest = nearestSlideIndex();
      if (nearest !== activePhysicalIndex) updateSlideState(nearest);
      if (Math.abs(velocity) < 0.22) beginSnap(nearest);
    }

    render();
    animationFrame = window.requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (animationFrame === null) animationFrame = window.requestAnimationFrame(animate);
  };

  const markInteraction = () => carousel.classList.add('has-interacted');

  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      markInteraction();
      beginSnap(activePhysicalIndex - 1);
      if (!reduceMotion) startAnimation();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      markInteraction();
      beginSnap(activePhysicalIndex + 1);
      if (!reduceMotion) startAnimation();
    }
  });

  track.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    isDragging = true;
    snapTarget = null;
    velocity = 0;
    dragStartX = event.clientX;
    dragStartPosition = currentX;
    lastPointerX = event.clientX;
    dragDistance = 0;
    track.classList.add('is-dragging');
    activePointerId = event.pointerId;
    if (track.setPointerCapture) {
      try { track.setPointerCapture(activePointerId); } catch (error) { activePointerId = event.pointerId; }
    }
    markInteraction();
  });

  track.addEventListener('pointermove', event => {
    if (!isDragging) return;
    const delta = event.clientX - lastPointerX;
    dragDistance = event.clientX - dragStartX;
    currentX = dragStartPosition + dragDistance;
    velocity = velocity * 0.55 + delta * 0.45;
    lastPointerX = event.clientX;
    const nearest = nearestSlideIndex();
    if (nearest !== activePhysicalIndex) updateSlideState(nearest);
    render();
  });

  const finishDrag = event => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('is-dragging');
    const pointerId = event?.pointerId ?? activePointerId;
    if (pointerId !== null && track.hasPointerCapture?.(pointerId)) {
      try { track.releasePointerCapture(pointerId); } catch (error) { /* Capture already released. */ }
    }
    activePointerId = null;
    if (reduceMotion) {
      beginSnap();
      return;
    }
    velocity *= 1.35;
    startAnimation();
  };

  track.addEventListener('pointerup', finishDrag);
  track.addEventListener('pointercancel', finishDrag);
  track.addEventListener('lostpointercapture', event => {
    if (isDragging) finishDrag(event);
  });
  carousel.addEventListener('pointerleave', event => {
    if (isDragging && activePointerId !== null && track.hasPointerCapture?.(activePointerId)) return;
    if (isDragging) finishDrag(event);

    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    velocity = 0;
    snapTarget = null;
    beginSnap();
    if (!reduceMotion) startAnimation();
  });
  track.addEventListener('click', event => {
    if (Math.abs(dragDistance) > 8) {
      event.preventDefault();
      return;
    }

    const selectedSlide = event.target.closest('.work-slide');
    const selectedIndex = slides.indexOf(selectedSlide);
    if (selectedIndex >= 0 && selectedIndex !== activePhysicalIndex) {
      event.preventDefault();
      markInteraction();
      beginSnap(selectedIndex);
      if (!reduceMotion) startAnimation();
    }
  }, true);

  carousel.addEventListener('wheel', event => {
    const isHorizontalGesture = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    const isShiftWheel = event.shiftKey && Math.abs(event.deltaY) > 0;

    if (!isHorizontalGesture && !isShiftWheel) return;

    const delta = isHorizontalGesture ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 1) return;
    event.preventDefault();
    markInteraction();
    if (reduceMotion) {
      beginSnap(activePhysicalIndex + (delta > 0 ? 1 : -1));
      return;
    }
    snapTarget = null;
    velocity += Math.max(Math.min(-delta * 0.085, 18), -18);
    startAnimation();
  }, { passive: false });

  currentX = positionFor(activePhysicalIndex);
  updateSlideState(activePhysicalIndex);
  render();
  window.addEventListener('resize', () => {
    currentX = positionFor(activePhysicalIndex);
    render();
  }, { passive: true });

}

/**
 * 9. Active Link Highlight (Scroll Spy)
 * Detects which section is in view and highlights the matching navigation link.
 */
function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sectionLabel = document.getElementById('sidebar-section');

  if (!sections.length || !navLinks.length) return;

  let activeId = '';
  let frameRequested = false;

  const setActiveSection = id => {
    if (id === activeId) return;
    activeId = id;
    document.body.dataset.scene = id;

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
        if (sectionLabel) sectionLabel.textContent = link.textContent.trim();
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const updateActiveSection = () => {
    const readingLine = window.innerHeight * 0.38;
    let current = sections[0];

    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= readingLine) current = section;
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }

    setActiveSection(current.id);
    frameRequested = false;
  };

  const requestUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateActiveSection);
  };

  updateActiveSection();
  registerViewportUpdate(updateActiveSection);
}
