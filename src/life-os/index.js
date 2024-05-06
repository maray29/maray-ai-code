import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import {
  animateCursor,
  animateCursorElements,
  animateFadeIn,
  animateNavDropdown,
  animateText,
} from '$animations/animations';
import changeTheme from '$utils/changeTheme';
import createLenis from '$utils/createLenis';

function init() {
  gsap.registerPlugin(ScrollTrigger);

  if (Webflow.env('editor') === undefined) {
    gsap.to('.page-wrapper', {
      autoAlpha: 1,
    });
  }

  changeTheme("[data-element='theme-toggle']");
  animateCursor('.cursor_inner');
  animateCursorElements([
    '[data-element="article-card"]',
    '[data-element="nav-dropdown-link"]',
    '[data-element="nav-articles-item"]',
  ]);
  animateNavDropdown();
  animateText('[data-element="text"]');
  animateFadeIn('[data-animation="fade-in"]');
  createLenis();
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
