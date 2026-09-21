/**
 * FARHAN ATTAR | PORTFOLIO JAVASCRIPT
 * Pure Vanilla JavaScript • Zero Frameworks • Production Ready
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. DYNAMIC YEAR
  // ---------------------------------------------------------------------------
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---------------------------------------------------------------------------
  // 2. THEME SWITCHER (DARK / LIGHT MODE)
  // ---------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootHtml = document.documentElement;

  // Initialize Theme: Dark mode is default
  const savedTheme = localStorage.getItem('fa_theme') || 'dark';
  rootHtml.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootHtml.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      rootHtml.setAttribute('data-theme', newTheme);
      localStorage.setItem('fa_theme', newTheme);

      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // ---------------------------------------------------------------------------
  // 3. STICKY HEADER SCROLL EFFECT
  // ---------------------------------------------------------------------------
  const header = document.getElementById('header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ---------------------------------------------------------------------------
  // 4. MOBILE NAVIGATION DRAWER
  // ---------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    if (shouldOpen) {
      navMenu.classList.add('open');
      mobileNavToggle.classList.add('open');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
    } else {
      navMenu.classList.remove('open');
      mobileNavToggle.classList.remove('open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Close nav on click outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !header.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  // ---------------------------------------------------------------------------
  // 5. ACTIVE NAV STATE ON SCROLL (INTERSECTION OBSERVER)
  // ---------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // ---------------------------------------------------------------------------
  // 6. SCROLL REVEAL ANIMATIONS
  // ---------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION UTILITY
  // ---------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  function showToast(message, duration = 3200) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // ---------------------------------------------------------------------------
  // 8. COPY EMAIL TO CLIPBOARD
  // ---------------------------------------------------------------------------
  const copyBtn = document.getElementById('copy-email-btn');
  const emailTextEl = document.getElementById('email-text');

  if (copyBtn && emailTextEl) {
    copyBtn.addEventListener('click', async () => {
      const email = emailTextEl.textContent.trim();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback method for older browsers or non-HTTPS local setups
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        showToast('Email copied to clipboard!');
      } catch (err) {
        showToast(`Email: ${email}`);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 9. PROJECT PLACEHOLDER DEMO CLICKS
  // ---------------------------------------------------------------------------
  const demoPlaceholderBtns = document.querySelectorAll('.demo-placeholder-btn');
  demoPlaceholderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectName = btn.getAttribute('data-project') || 'Project';
      showToast(`${projectName} live demo preview is coming soon!`);
    });
  });

  // ---------------------------------------------------------------------------
  // 10. RECRUITER CONTACT FORM INTERACTION
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('user-name');
      const emailInput = document.getElementById('user-email');
      const subjectInput = document.getElementById('user-subject');
      const messageInput = document.getElementById('user-message');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      // Basic validation
      if (!name || !email || !subject || !message) {
        showToast('Please fill out all fields before submitting.');
        return;
      }

      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      // Simulate successful submission
      showToast(`Thank you, ${name}! Your message has been sent successfully.`);
      contactForm.reset();
    });
  }
});
