import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  // Loader counter
  const counter = {
    value: 75,
  };

  const counterText = document.querySelector("[am-element='counter-text']");
  const counterIcon = document.querySelector("[am-element='counter-icon']");
  console.log(counterText);

  function updateCounter() {
    const progress = Math.round(counter.value);
    counterText.textContent = progress.toString();
  }

  const loadingTl = gsap.timeline();
  // loadingTl.to(counterIcon, { rotate: 360, ease: 'none', duration: 4 });

  loadingTl.to(counter, {
    onUpdate: updateCounter,
    duration: 1.25,
    value: 100,
  });
  loadingTl.to(
    counterIcon,
    {
      rotate: 120,
      ease: 'power2.out',
      duration: 1.25,
    },
    '<'
  );

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
  // Heading cubes image animation
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

  // The text message animation that is below the header.
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

gsap.registerPlugin(ScrollTrigger);

const paths = document.querySelectorAll('.feature-path');
const featureItems = document.querySelectorAll('.template-features_item');

for (let i = 0; i < paths.length; i++) {
  const path = paths[i],
    length = path.getTotalLength();

  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
}

let featureItem;

for (let i = 0; i < featureItems.length; i++) {
  featureItem = featureItems[i];
  gsap.set(featureItem, { opacity: 0, y: 100 });
  gsap.to(featureItem, {
    scrollTrigger: {
      trigger: featureItem,
      start: '30% bottom',
      end: '50%',
      // scrub: 1,
      // markers: true
    },
    duration: 1,
    opacity: 1,
    y: 0,
    stagger: 0.5,
    immediateRender: false,
  });

  gsap.to(paths[i], {
    strokeDashoffset: 0,
    stroke: '#DCD2D2',
    duration: 3,
    // stagger: 0.7,
    scrollTrigger: {
      trigger: featureItem,
      start: '30% bottom',
    },
  });
}
