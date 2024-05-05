import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { animateCursor, animateCursorElements, animateNavDropdown } from '$animations/animations';
import changeTheme from '$utils/changeTheme';
import createLenis from '$utils/createLenis';

function init() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set('.tooltip_component', { autoAlpha: 0 });

  createLenis();
  changeTheme("[data-element='theme-toggle']");
  animateCursor('.cursor_inner');
  animateCursorElements([
    '[data-element="nav-dropdown-link"]',
    '[data-element="nav-articles-item"]',
  ]);
  animateNavDropdown();
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
