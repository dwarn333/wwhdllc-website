/* ==========================================================================
   WW Housing Development LLC — script.js
   Homepage-only behavior. Site-wide behavior lives in global.js.

   Currently: hero photo carousel (crossfade, auto-advance, arrow controls).
   ========================================================================== */

(function () {
  'use strict';

  var hero = document.querySelector('.hero');

  if (!hero) {
    return;
  }

  var slides = hero.querySelectorAll('.hero__slide');
  var prevButton = hero.querySelector('[data-hero-prev]');
  var nextButton = hero.querySelector('[data-hero-next]');

  /* Nothing to cycle through */
  if (slides.length < 2) {
    return;
  }

  var ACTIVE_CLASS = 'is-active';
  var INTERVAL = 6000;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var index = 0;
  var timer = null;

  function show(nextIndex) {
    slides[index].classList.remove(ACTIVE_CLASS);
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add(ACTIVE_CLASS);
  }

  function stop() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    /* Hold a single still photograph when motion is not welcome */
    if (reducedMotion.matches) {
      return;
    }

    stop();

    timer = window.setInterval(function () {
      show(index + 1);
    }, INTERVAL);
  }

  /* Manual navigation restarts the clock, so a chosen photo gets a full turn */
  function goTo(nextIndex) {
    show(nextIndex);
    start();
  }

  if (prevButton) {
    prevButton.addEventListener('click', function () {
      goTo(index - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', function () {
      goTo(index + 1);
    });
  }

  /* Pause while a keyboard user is tabbing through the hero. No hover pause:
     the hero fills the screen on arrival, so the cursor is nearly always over
     it and the photos would never start turning. */
  hero.addEventListener('focusin', stop);
  hero.addEventListener('focusout', start);

  /* No point cycling in a backgrounded tab */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  function handleMotionPreference() {
    if (reducedMotion.matches) {
      stop();
    } else {
      start();
    }
  }

  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', handleMotionPreference);
  } else if (typeof reducedMotion.addListener === 'function') {
    reducedMotion.addListener(handleMotionPreference);
  }

  start();
})();

/* The step-card activation moved to global.js when the /start/ landing page
   started using the same cards. */
