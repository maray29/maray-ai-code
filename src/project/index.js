import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { animateCursor, animateNavDropdown, animatePageFadeIn } from '$animations/animations';
import changeTheme from '$utils/changeTheme';
import createLenis from '$utils/createLenis';

window.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(CustomEase);

  createLenis();
  animatePageFadeIn();
  animateNavDropdown();
  animateCursor('.cursor_inner');
  changeTheme("[data-element='theme-toggle']");
});
