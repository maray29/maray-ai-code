import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import changeTheme from '$utils/changeTheme';
import createLenis from '$utils/createLenis';

function init() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to('.page-wrapper', {
    autoAlpha: 1,
  });

  gsap.set('.tooltip', { autoAlpha: 0 });

  createLenis();
  animateHeader();
  changeTheme();
}

function animateHeader() {
  const img1 = document.querySelector('.lawyers_header_website-img-1');
  const img2 = document.querySelector('.lawyers_header_website-img-2');
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.lawyers_header_website-img-wrap',
      start: 'clamp(top 10%)',
      end: '+=1000',
      scrub: 1,
      markers: true,
      pin: '.lawyers_header_website-img-wrap',
      pinReparent: true,
    },
  });

  const rect = document.querySelector('.lawyers_header_website-img-wrap').getBoundingClientRect();
  console.log(rect);
  const distance = window.innerWidth / 2 - rect.left - rect.width / 2;

  tl.to('.lawyers_header_content', {
    y: -500,
  })
    .to(
      img1,
      {
        x: 0,
        y: 100,
        transform: 'rotate(0deg)',
        scale: 1,
      },
      '<'
    )
    .to(
      img2,
      {
        x: 0,
        y: 100,
        transform: 'rotate(0deg)',
        scale: 1,
      },
      '<'
    )
    .to(
      '.lawyers_header_website-img-wrap',
      {
        x: distance,
      },
      '<'
    )
    .to(
      '.tooltip',
      {
        y: 1100,
        autoAlpha: 1,
        // stagger: 0.1,
      },
      '<0.5'
    );
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
