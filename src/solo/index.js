/* eslint-disable no-return-assign */
import 'swiper/css';

import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  animateCursor,
  animateCursorElements,
  animateFadeIn,
  animateNavDropdown,
  animateText,
} from '$animations/animations';
import {
  animateFadeInScrub,
  animateProcessText,
  animateProjectsParallax,
} from '$animations/animations';
import changeTheme from '$utils/changeTheme';
import scrollTo from '$utils/scrollTo.js';

window.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.1, duration: 1.5 });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  scrollTo();
  animateCursor();
  animateCursorElements();
  animateText();
  animateFadeIn('[data-animation="fade-in"]');
  changeTheme("[data-element='theme-toggle']");
  animateNavDropdown();
  animateProcessText('[data-animation="words"]');
  animateFadeInScrub('[data-animation="fade-in-scrub"]');
  animateProjectsParallax('[data-element="project"]');
});
