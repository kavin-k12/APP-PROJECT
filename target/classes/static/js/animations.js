/**
 * CAMPUS CONNECT 2030 — GSAP & SCI-FI UI ANIMATIONS
 * Implements cinematic title reveals, laser scanning lines, scroll triggers,
 * and smooth transitions.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navbar glass blur on scroll
  const navbar = document.querySelector('.navbar-futuristic');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // If user prefers reduced motion, disable complex GSAP timelines
  if (prefersReducedMotion || typeof gsap === 'undefined') {
    return;
  }

  // Hero Section Cinematic Entrance Timeline
  window.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDesc = document.querySelector('.hero-description');
    const heroActions = document.querySelector('.hero-actions');
    const heroBadge = document.querySelector('.hero-badge');
    const statsItems = document.querySelectorAll('.stat-item');

    if (heroTitle) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (heroBadge) {
        tl.fromTo(heroBadge, { opacity: 0, y: -20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8 });
      }

      tl.fromTo(
        heroTitle,
        { opacity: 0, y: 30, letterSpacing: '0.15em' },
        { opacity: 1, y: 0, letterSpacing: '0.08em', duration: 1.1 },
        '-=0.4'
      );

      if (heroSubtitle) {
        tl.fromTo(
          heroSubtitle,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        );
      }

      if (heroDesc) {
        tl.fromTo(
          heroDesc,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        );
      }

      if (heroActions) {
        tl.fromTo(
          heroActions,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        );
      }

      if (statsItems.length > 0) {
        tl.fromTo(
          statsItems,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.7 },
          '-=0.4'
        );
      }
    }

    // Scroll reveal observers for glass panels & portal cards
    const revealElements = document.querySelectorAll('.portal-card, .team-card, .module-card, .glass-panel');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                entry.target,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
              );
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      revealElements.forEach((el) => {
        el.style.opacity = '0';
        observer.observe(el);
      });
    }
  });
})();
