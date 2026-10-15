/**
 * KRISTINE MAE MONTAJAS — PORTFOLIO CONTROLLER
 * Pure Vanilla JavaScript (ES6+), Zero External Libraries
 * High-performance, Accessible (WCAG 2.1 AA compliant)
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DOM SELECTORS
  // --------------------------------------------------------------------------
  const hudToggle = document.getElementById('hudToggle');
  const hudLinks = document.getElementById('hudLinks');
  const navItems = document.querySelectorAll('.hud-link');
  const sections = document.querySelectorAll('section[id]');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const trophyCards = document.querySelectorAll('.trophy-card');
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const credentialModal = document.getElementById('credentialModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalIssuer = document.getElementById('modalIssuer');
  const modalVerifyLink = document.getElementById('modalVerifyLink');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  const flagshipInspectBtn = document.getElementById('flagshipInspectBtn');

  let lastActiveElement = null;
  let copyTimeout = null;

  // --------------------------------------------------------------------------
  // 2. MOBILE HUD DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  function openMobileNav() {
    if (!hudToggle || !hudLinks) return;
    hudToggle.setAttribute('aria-expanded', 'true');
    hudToggle.classList.add('is-active');
    hudLinks.classList.add('mobile-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!hudToggle || !hudLinks) return;
    hudToggle.setAttribute('aria-expanded', 'false');
    hudToggle.classList.remove('is-active');
    hudLinks.classList.remove('mobile-open');
    document.body.style.overflow = '';
  }

  if (hudToggle && hudLinks) {
    hudToggle.addEventListener('click', () => {
      const isExpanded = hudToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close menu when clicking any nav link
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!hudLinks.contains(e.target) && !hudToggle.contains(e.target) && hudLinks.classList.contains('mobile-open')) {
        closeMobileNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hudLinks.classList.contains('mobile-open')) {
        closeMobileNav();
        hudToggle.focus();
      }
    });

    // Reset drawer and unlock body scroll if window is resized above mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && hudLinks.classList.contains('mobile-open')) {
        closeMobileNav();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. MULTI-PAGE ACTIVE NAV & IN-PAGE SCROLL-SPY (WHEN HASH NAV PRESENT)
  // --------------------------------------------------------------------------
  // Automatically identify and verify the current page link (handles clean URLs & .html)
  const rawPath = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const currentBase = rawPath.toLowerCase().replace(/\.html$/, '');

  navItems.forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    const cleanHref = href.split('#')[0].split('?')[0];
    const targetBase = cleanHref.split('/').filter(Boolean).pop().replace(/\.html$/, '');

    if (targetBase === currentBase || (currentBase === 'index' && targetBase === 'index')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else if (cleanHref.endsWith('.html') || targetBase) {
      // Don't wipe active if already correctly set or on a section
      if (targetBase !== currentBase) {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    }
  });

  // Only run in-page scroll-spy if navigation is using in-page hash anchors
  const hasInPageHashNav = Array.from(navItems).some(link => {
    const href = link.getAttribute('href') || '';
    return href.startsWith('#') && href.length > 1;
  });

  function setActiveNav(targetId) {
    navItems.forEach(link => {
      if (link.getAttribute('href') === `#${targetId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  if (hasInPageHashNav && 'IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -55% 0px',
      threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          setActiveNav(currentId);
        }
      });
    }, observerOptions);

    sections.forEach(section => spyObserver.observe(section));

    // Guaranteed bottom-of-page highlight for Contact section
    window.addEventListener('scroll', () => {
      const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
      if (atBottom) {
        setActiveNav('contact');
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // 4. TROPHY ROOM CATEGORY FILTERING & ARIA TABLIST
  // --------------------------------------------------------------------------
  if (filterTabs.length > 0 && trophyCards.length > 0) {
    filterTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');

        // Update active tab styling & ARIA attributes
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Filter cards
        trophyCards.forEach(card => {
          const rawCat = card.getAttribute('data-category') || '';
          const cats = rawCat.toLowerCase().split(/\s+/);
          if (filter === 'all' || cats.includes(filter) || rawCat === filter || (filter === 'cisco' && rawCat.includes('cisco'))) {
            card.style.display = 'flex';
            card.classList.remove('tab-filter-animate');
            void card.offsetWidth;
            card.classList.add('tab-filter-animate');
          } else {
            card.style.display = 'none';
          }
        });
      });

      // Keyboard arrow navigation for tabs (WAI-ARIA Tablist Pattern)
      tab.addEventListener('keydown', (e) => {
        let newIndex = null;
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % filterTabs.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + filterTabs.length) % filterTabs.length;
        } else if (e.key === 'Home') {
          newIndex = 0;
        } else if (e.key === 'End') {
          newIndex = filterTabs.length - 1;
        }

        if (newIndex !== null) {
          e.preventDefault();
          filterTabs[newIndex].focus();
          filterTabs[newIndex].click();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4B. PROJECT CATEGORY FILTERING & ARIA TABLIST
  // --------------------------------------------------------------------------
  const projectFilterTabs = document.querySelectorAll('.project-filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  if (projectFilterTabs.length > 0 && projectCards.length > 0) {
    projectFilterTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');

        projectFilterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        projectCards.forEach(card => {
          const rawCat = card.getAttribute('data-project-category') || '';
          const cats = rawCat.toLowerCase().split(/\s+/);
          if (filter === 'all' || cats.includes(filter) || rawCat === filter) {
            card.style.display = '';
            card.classList.remove('tab-filter-animate');
            void card.offsetWidth;
            card.classList.add('tab-filter-animate');
          } else {
            card.style.display = 'none';
          }
        });
      });

      tab.addEventListener('keydown', (e) => {
        let newIndex = null;
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % projectFilterTabs.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + projectFilterTabs.length) % projectFilterTabs.length;
        } else if (e.key === 'Home') {
          newIndex = 0;
        } else if (e.key === 'End') {
          newIndex = projectFilterTabs.length - 1;
        }

        if (newIndex !== null) {
          e.preventDefault();
          projectFilterTabs[newIndex].focus();
          projectFilterTabs[newIndex].click();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4C. SKILL CATEGORY FILTERING & ARIA TABLIST
  // --------------------------------------------------------------------------
  const skillFilterTabs = document.querySelectorAll('.skill-filter-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (skillFilterTabs.length > 0 && skillCards.length > 0) {
    skillFilterTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');

        skillFilterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        skillCards.forEach(card => {
          const rawCat = card.getAttribute('data-skill-category') || '';
          if (filter === 'all' || rawCat === filter || rawCat.includes(filter)) {
            card.style.display = '';
            card.classList.remove('tab-filter-animate');
            void card.offsetWidth;
            card.classList.add('tab-filter-animate');
          } else {
            card.style.display = 'none';
          }
        });
      });

      tab.addEventListener('keydown', (e) => {
        let newIndex = null;
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % skillFilterTabs.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + skillFilterTabs.length) % skillFilterTabs.length;
        } else if (e.key === 'Home') {
          newIndex = 0;
        } else if (e.key === 'End') {
          newIndex = skillFilterTabs.length - 1;
        }

        if (newIndex !== null) {
          e.preventDefault();
          skillFilterTabs[newIndex].focus();
          skillFilterTabs[newIndex].click();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. ACCESSIBLE HTML5 <dialog> MODAL PREVIEW LIGHTBOX (WCAG 2.1 AA)
  // --------------------------------------------------------------------------
  function openModal(imgSrc, title, issuer, verifyUrl) {
    if (!credentialModal || credentialModal.open) return;

    lastActiveElement = document.activeElement;

    if (modalImg) {
      modalImg.src = imgSrc;
      modalImg.alt = title || '';
    }
    if (modalTitle) {
      modalTitle.textContent = title || '';
    }
    if (modalIssuer) {
      modalIssuer.textContent = issuer || '';
    }
    if (modalVerifyLink) {
      if (verifyUrl && verifyUrl.trim() !== '') {
        modalVerifyLink.href = verifyUrl;
        modalVerifyLink.style.display = 'inline-flex';
      } else {
        modalVerifyLink.style.display = 'none';
      }
    }

    document.body.style.overflow = 'hidden';

    if (typeof credentialModal.showModal === 'function') {
      credentialModal.showModal();
    } else {
      credentialModal.setAttribute('open', '');
    }

    if (modalCloseBtn) {
      modalCloseBtn.focus();
    }
  }

  function closeModal() {
    if (!credentialModal) return;

    document.body.style.overflow = '';

    if (typeof credentialModal.close === 'function') {
      if (credentialModal.open) {
        credentialModal.close();
      }
    } else {
      credentialModal.removeAttribute('open');
    }

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  // Handle native <dialog> cancel / close event (e.g. Escape key)
  if (credentialModal) {
    credentialModal.addEventListener('close', () => {
      document.body.style.overflow = '';
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    });

    // Close when clicking outside dialog window (on ::backdrop)
    credentialModal.addEventListener('click', (e) => {
      if (e.target === credentialModal) {
        const rect = credentialModal.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          closeModal();
        }
      }
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Bind Trophy Cards to Lightbox
  trophyCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const issuer = card.getAttribute('data-issuer');
      const verifyUrl = card.getAttribute('data-verify');
      openModal(imgSrc, title, issuer, verifyUrl);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Bind Declarative Modal Triggers (e.g. Project buttons)
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const imgSrc = btn.getAttribute('data-modal-img');
      const title = btn.getAttribute('data-modal-title');
      const issuer = btn.getAttribute('data-modal-issuer');
      const verifyUrl = btn.getAttribute('data-modal-verify');
      openModal(imgSrc, title, issuer, verifyUrl);
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Flagship Certiport Inspect Trigger
  if (flagshipInspectBtn) {
    flagshipInspectBtn.addEventListener('click', () => {
      openModal(
        'images/IT Specialist Cybersecurity.png',
        'Information Technology Specialist: Cybersecurity',
        'Certiport / Pearson VUE / CertNexus · Code: nBoB-uT27',
        'https://verify.certiport.com'
      );
    });
  }

  // --------------------------------------------------------------------------
  // 6. COPY EMAIL QUICK-ACTION
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('#copyEmailBtn, .btn-copy-email, [data-copy-email]');
  if (copyButtons.length > 0) {
    copyButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email') || 'montajaskristinemae@gmail.com';
        const feedbackEl = btn.querySelector('.copy-feedback') || document.getElementById('copyFeedback') || btn;
        const originalText = feedbackEl.textContent;

        const showSuccess = () => {
          feedbackEl.textContent = 'Copied to clipboard!';
          feedbackEl.style.color = 'var(--accent-verified)';
          if (copyTimeout) clearTimeout(copyTimeout);
          copyTimeout = setTimeout(() => {
            feedbackEl.textContent = originalText;
            feedbackEl.style.color = '';
          }, 2500);
        };

        try {
          await navigator.clipboard.writeText(email);
          showSuccess();
        } catch (err) {
          // Fallback for older browsers / unsecure contexts
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            showSuccess();
          } catch (e) {
            feedbackEl.textContent = 'Please copy manually';
          }
          document.body.removeChild(textarea);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. VANTA.NET 3D ANIMATED NETWORK BACKGROUND
  // --------------------------------------------------------------------------
  let vantaEffect = null;
  let vantaInitAttempts = 0;
  const MAX_VANTA_ATTEMPTS = 5;

  const motionQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function shouldReduceMotion() {
    return !!(motionQuery && motionQuery.matches);
  }

  function destroyVantaBackground() {
    if (vantaEffect && typeof vantaEffect.destroy === 'function') {
      try {
        vantaEffect.destroy();
      } catch (_) {}
      vantaEffect = null;
    }
  }

  function initVantaBackground() {
    const vantaEl = document.getElementById('vanta-bg');
    if (!vantaEl) return;

    // Accessibility check: suppress WebGL animation if user prefers reduced motion
    if (shouldReduceMotion()) {
      destroyVantaBackground();
      return;
    }

    // Safety checks: ensure Three.js and Vanta.NET libraries are ready
    if (typeof window.THREE === 'undefined' || typeof window.VANTA === 'undefined' || typeof window.VANTA.NET !== 'function') {
      // Retry if external CDN scripts are still downloading
      if (vantaInitAttempts < MAX_VANTA_ATTEMPTS) {
        vantaInitAttempts++;
        setTimeout(initVantaBackground, 300);
      }
      return;
    }

    // Prevent duplicate initializations
    if (vantaEffect) return;

    try {
      vantaEffect = window.VANTA.NET({
        el: vantaEl,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xd13fff,
        backgroundColor: 0x090c10,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 16.00,
        showDots: true
      });
    } catch (err) {
      // Graceful fallback to CSS background without unhandled exceptions
      console.warn('Vanta.NET initialization deferred to CSS fallback:', err);
      destroyVantaBackground();
    }
  }

  // Handle dynamic changes to reduced motion preferences
  if (motionQuery) {
    const onMotionChange = (e) => {
      if (e.matches) {
        destroyVantaBackground();
      } else {
        initVantaBackground();
      }
    };
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', onMotionChange);
    } else if (typeof motionQuery.addListener === 'function') {
      motionQuery.addListener(onMotionChange);
    }
  }

  // --------------------------------------------------------------------------
  // 10. SEAMLESS PAGE MOTION & CLICK TRANSITIONS
  // --------------------------------------------------------------------------
  function initPageMotion() {
    let progressBar = document.getElementById('page-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'page-progress-bar';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    requestAnimationFrame(() => {
      document.body.classList.add('page-ready');
      document.body.classList.remove('is-exiting');
      if (progressBar) progressBar.style.width = '0%';
    });

    window.addEventListener('pageshow', () => {
      document.body.classList.add('page-ready');
      document.body.classList.remove('is-exiting');
      if (progressBar) progressBar.style.width = '0%';
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;

      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (target === '_blank' || link.hasAttribute('download')) return;

      const isInternal = !href.startsWith('http://') && !href.startsWith('https://') || href.startsWith(window.location.origin);
      if (!isInternal) return;

      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const targetPath = href.split('#')[0].split('?')[0].split('/').pop();
      if (currentPath === targetPath && href.includes('#')) return;

      if (shouldReduceMotion()) return;

      e.preventDefault();
      document.body.classList.remove('page-ready');
      document.body.classList.add('is-exiting');

      setTimeout(() => {
        window.location.href = href;
      }, 200);
    });
  }

  // Initialize once DOM elements are parsed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initVantaBackground();
      initPageMotion();
    });
  } else {
    initVantaBackground();
    initPageMotion();
  }

  // Fallback in case external scripts finish after controller
  window.addEventListener('load', () => {
    if (!vantaEffect && !shouldReduceMotion()) {
      initVantaBackground();
    }
    initPageMotion();
  });

  // Clean disposal on page unload to prevent WebGL context memory leaks
  window.addEventListener('beforeunload', destroyVantaBackground);

})();

