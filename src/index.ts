import { gsap } from 'gsap';

import { Gradient } from '$utils/gradient.js';

// import { SplitType } from 'split-type';

window.Webflow ||= [];
window.Webflow.push(() => {
  // Create your instance
  const gradient = new Gradient();

  // Call `initGradient` with the selector to your canvas
  gradient.initGradient('#gradient-canvas');
  gradient.amp = 20;

  // let headingText;
  // let messageText;

  // function runSplit() {
  //   // Split text into words and characters
  //   headingText = new SplitType('.header-home_heading-v3', { types: 'lines, words, chars' });
  //   messageText = new SplitType('.message_text', { types: 'lines, words, chars' });
  // }

  // runSplit();

  const loadingTl = gsap.timeline();
  loadingTl.to('.loading-icon', { rotate: 360, ease: 'none', duration: 0.8 });

  loadingTl.to('.loading-screen', {
    yPercent: -100,
    delay: 0.5,
    duration: 0.85,
    ease: 'power2.out',
  });
  loadingTl.to(
    '.loading-shape',
    {
      // yPercent: -100,
      top: '100%',
      duration: 0.85,
      ease: 'power2.out',
    },
    '<'
  );

  loadingTl.from(
    '.header-home_heading-v3',
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

  loadingTl.from(
    '.header_image',
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

  loadingTl.from(
    '.message_text',
    {
      // delay: 0.1,
      // opacity: 0,
      y: 300,
      duration: 1,
      ease: 'power3.out',
    },
    '<'
  );
});
