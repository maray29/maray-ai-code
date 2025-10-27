import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { animateCursor, animateCursorElements, animateNavDropdown } from '$animations/animations';
import changeTheme from '$utils/changeTheme';
import createLenis from '$utils/createLenis';
import { Gradient } from '$utils/gradient';

gsap.registerPlugin(ScrollTrigger);

/* Set Footer Copyright Year */
function setCopyrightYear() {
  const copyRightYear = document.querySelector('[am-element="copyright-year"]');
  copyRightYear.textContent = new Date().getFullYear();
}

function createLoadingAnimation() {
  // Create your instance
  const gradient = new Gradient();
  if (!gradient) {
    return;
  }

  // Call `initGradient` with the selector to your canvas
  gradient.initGradient('#gradient-canvas');
  gradient.amp = 20;

  // Loader counter
  const counter = {
    value: 75,
  };

  const counterText = document.querySelector("[am-element='counter-text']");
  const counterIcon = document.querySelector("[am-element='counter-icon']");

  if (!counterText || !counterIcon) {
    return;
  }

  function updateCounter() {
    const progress = Math.round(counter.value);
    counterText.textContent = progress.toString();
  }

  const loadingTl = gsap.timeline();

  // loadingTl.to(counter, {
  //   onUpdate: updateCounter,
  //   duration: 1.25,
  //   value: 100,
  // });
  // loadingTl.to(
  //   counterIcon,
  //   {
  //     rotate: 120,
  //     ease: 'power2.out',
  //     duration: 1.25,
  //   },
  //   '<'
  // );

  loadingTl.set('.loading-container', {
    display: 'flex',
  });

  loadingTl.set('.page-wrapper', {
    autoAlpha: 1,
  });

  //Loading screen animation
  loadingTl.to('.loading-screen', {
    yPercent: -100,
    duration: 0.85,
    ease: 'power2.out',
  });
  loadingTl.to(
    '.loading-shape',
    {
      top: '100%',
      duration: 0.85,
      ease: 'power2.out',
    },
    '<'
  );

  // Heading animation
  loadingTl.from(
    '.blog-header_heading',
    {
      delay: 0.1,
      // opacity: 0,
      y: 400,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
    },
    '<'
  );
  // Heading cubes image animation
  loadingTl.from(
    '.blog-header_img',
    {
      delay: 0.1,
      // opacity: 0,
      y: 300,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
    },
    '<'
  );

  // The text message animation that is below the header.
  loadingTl.from(
    '.blog-header_message-text',
    {
      // delay: 0.1,
      // opacity: 0,
      y: 300,
      duration: 1,
      ease: 'power3.out',
    },
    '<'
  );
}

window.addEventListener('DOMContentLoaded', () => {
  createLenis();
  setCopyrightYear();
  createLoadingAnimation();

  changeTheme("[data-element='theme-toggle']");
  animateCursor();
  animateCursorElements();
  animateNavDropdown();
});
