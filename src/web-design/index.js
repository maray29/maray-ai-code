import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import changeTheme from '$utils/changeTheme';
import createLenis from '$utils/createLenis';

import { animateCursor } from '../animations/animations';

function init() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to('.page-wrapper', {
    autoAlpha: 1,
  });

  gsap.set('.tooltip_component', { autoAlpha: 0 });

  createLenis();
  animateHeader();
  changeTheme("[data-element='theme-toggle']");
  animateCursor('.cursor_inner');
}

function animateHeader() {
  const img1 = document.querySelector('.lawyers_header_img-1');
  const img2 = document.querySelector('.lawyers_header_img-2');
  const rect = document.querySelector('.lawyers_header_img-container').getBoundingClientRect();
  const distance = document.documentElement.clientWidth / 2 - rect.left - rect.width / 2;

  let mm = gsap.matchMedia();
  let endDistance;
  let img1MovementDistance;
  let img2MovementDistance;

  mm.add('(min-width: 992px)', () => {
    // desktop setup code here...
    endDistance = 1000;
    img1MovementDistance = 100;
    img2MovementDistance = 150;
  });

  mm.add('(max-width: 991px)', () => {
    // mobile setup code here...
    endDistance = 600;
    img1MovementDistance = 100;
    img2MovementDistance = 150;
  });

  mm.add('(max-width: 478px)', () => {
    // mobile setup code here...
    endDistance = 300;
    img1MovementDistance = 0;
    img2MovementDistance = 0;
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.lawyers_header_img-container',
      start: 'clamp(top 100px)',
      end: `+=${endDistance}`,
      scrub: true,
      markers: true,
      pin: '.lawyers_header_img-container',
      pinReparent: true,
    },
  });

  tl.to('.lawyers_header_content', {
    y: -500,
  })
    .to(
      img1,
      {
        // x: 0,
        y: img1MovementDistance,
        transform: 'rotate(0deg)',
        scale: 1,
      },
      '<'
    )
    .to(
      img2,
      {
        // x: 0,
        y: img2MovementDistance,
        transform: 'rotate(0deg)',
        scale: 1,
      },
      '<'
    )
    .to(
      '.lawyers_header_img-container',
      {
        x: distance,
      },
      '<'
    )
    .to(
      '.tooltip_component',
      {
        y: endDistance + 100,
        autoAlpha: 1,
        // stagger: 0.1,
      },
      '<0.5'
    );
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
