import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Gradient } from '$utils/gradient.js';

// import { SplitType } from 'split-type';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  //Blog OS Landing page animation
  const blogosHeadingCard = document.querySelector('[am-element="blogos-card"]');
  const templateHeadingCard = document.querySelector('[am-element="template-card"]');

  const blogosScreenshots = document.querySelectorAll('[am-element="blogos-screenshot"]');
  const templateScreenshots = document.querySelectorAll('[am-element="template-screenshot"]');

  // Section heading animation
  gsap.to(blogosHeadingCard, {
    y: -500,
    // ease: 'none',
    stagger: 0.1,
    scrollTrigger: {
      trigger: blogosHeadingCard,
      start: 'top bottom',
      end: 'bottom top',
      markers: true,
      scrub: 1,
    },
  });

  let screenshotMoveSpeed = 100;
  console.log(blogosScreenshots);

  // Section screenshots animation
  blogosScreenshots.forEach((screenshot) => {
    screenshotMoveSpeed += 150;
    gsap.to(screenshot, {
      y: screenshotMoveSpeed * -1,
      // ease: 'none',
      stagger: 0.1,
      scrollTrigger: {
        trigger: blogosHeadingCard,
        start: 'top bottom',
        end: 'bottom top',
        // markers: true,
        scrub: 1,
      },
      onComplete: () => {
        screenshotMoveSpeed = 100;
      },
    });
  });

  // Section heading animation
  gsap.to(templateHeadingCard, {
    y: -500,
    // ease: 'none',
    stagger: 0.1,
    scrollTrigger: {
      trigger: templateHeadingCard,
      start: 'top bottom',
      end: 'bottom top',
      markers: true,
      scrub: 1,
    },
  });

  // Reset speed
  screenshotMoveSpeed = 100;

  // Section screenshots animation
  templateScreenshots.forEach((screenshot) => {
    screenshotMoveSpeed += 150;
    gsap.to(screenshot, {
      y: screenshotMoveSpeed * -1,
      // ease: 'none',
      stagger: 0.1,
      scrollTrigger: {
        trigger: templateHeadingCard,
        start: 'top bottom',
        end: 'bottom top',
        // markers: true,
        scrub: 1,
      },
    });
  });
});

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
