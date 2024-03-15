import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { animateCursor, animateCursorElements, animateNavDropdown } from '$animations/animations';
import changeTheme from '$utils/changeTheme';
import createLenis from '$utils/createLenis';

function init() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set('.tooltip_component', { autoAlpha: 0 });

  createLenis();
  animatePageLoad();
  animateHeader();
  changeTheme("[data-element='theme-toggle']");
  animateCursor('.cursor_inner');
  animateCursorElements([
    '[data-element="nav-dropdown-link"]',
    '[data-element="nav-articles-item"]',
  ]);
  animateNavDropdown();
}

function animatePageLoad() {
  const img1 = document.querySelector('.lawyers_header_img-1');
  const img2 = document.querySelector('.lawyers_header_img-2');
  const headerContent = document.querySelector('.lawyers_header_content');

  const mm = gsap.matchMedia();

  mm.add('(min-width: 479px)', () => {
    const tl = gsap.timeline();
    tl.to('.page-wrapper', {
      autoAlpha: 1,
    })
      .from(img1, {
        autoAlpha: 0,
        // transform: 'rotate(0deg)',
        rotationY: 0,
        y: 300,
        duration: 1,
      })
      .from(
        img2,
        {
          autoAlpha: 0,
          rotationY: 0,
          y: 300,
          duration: 0.75,
        },
        '<0.25'
      )
      .from(headerContent, {
        autoAlpha: 0,
      });
  });

  mm.add('(max-width: 478px)', () => {
    const tl = gsap.timeline();
    tl.to('.page-wrapper', {
      autoAlpha: 1,
    })
      .from(headerContent, {
        autoAlpha: 0,
        y: 100,
        duration: 0.75,
      })
      .from(
        img1,
        {
          autoAlpha: 0,
          // transform: 'rotate(0deg)',
          rotationY: 0,
          y: 300,
          duration: 1,
        },
        '<'
      )
      .from(
        img2,
        {
          autoAlpha: 0,
          rotationY: 0,
          y: 300,
          duration: 0.75,
        },
        '<0.15'
      );
  });
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
  let isPinned;
  let start;
  let headerContentMovementDistance;

  mm.add('(min-width: 992px)', () => {
    // desktop setup code here...
    endDistance = 1000;
    img1MovementDistance = 100;
    img2MovementDistance = 150;
    isPinned = true;
    start = '100px';
    headerContentMovementDistance: -500;
  });

  mm.add('(max-width: 991px)', () => {
    // mobile setup code here...
    endDistance = 600;
    img1MovementDistance = 100;
    img2MovementDistance = 150;
    isPinned = true;
    start = '100px';
    headerContentMovementDistance = -500;
  });

  mm.add('(max-width: 478px)', () => {
    // mobile setup code here...
    endDistance = 1200;
    img1MovementDistance = 0;
    img2MovementDistance = 0;
    isPinned = false;
    start = '50%';
    headerContentMovementDistance = 0;
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.lawyers_header_img-container',
      start: `clamp(top ${start})`,
      end: `+=${endDistance}`,
      scrub: 1,
      pin: isPinned ? '.lawyers_header_img-container' : undefined,
      pinReparent: isPinned ? true : false,
      anticipatePin: 1,
      // markers: true,
    },
  });

  tl.to('.lawyers_header_content', {
    y: headerContentMovementDistance,
  })
    .to(
      img1,
      {
        // x: 0,
        y: img1MovementDistance,
        transform: 'rotate(0deg)',
        // rotationY: 0,
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
        // rotationY: 0,
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
        y: endDistance + img1MovementDistance,
        autoAlpha: 1,
        // stagger: 0.1,
      },
      '<0.5'
    );
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
