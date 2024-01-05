import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import changeTheme from '$utils/changeTheme';
import { isMobileDevice } from '$utils/isMobile';

import {
  animateCursor,
  animateCursorElements,
  animateFadeIn,
  animateText,
} from '../animations/animations';

function animateHeader() {
  const pageWrapper = document.querySelector('.page-wrapper');
  const headerImg = document.querySelector('[data-element="webflow-header-img"]');
  const headerHeading = document.querySelector('[data-element="heading"]');
  const headerSubheading = document.querySelector('[data-element="subheading"]');
  const headerButtons = document.querySelector('[data-element="buttons"]');
  const headerImgOverlay = document.querySelector('.overlay');

  const ease = CustomEase.create(
    'custom',
    'M0,0 C0.134,0.03 0.244,0.09 0.298,0.168 0.395,0.308 0.423,0.682 0.55,0.82 0.631,0.908 0.752,1 1,1 '
  );

  gsap.to(pageWrapper, {
    autoAlpha: 1,
  });

  gsap.set(headerImg, {
    scale: 1.2,
    yPercent: 20,
  });

  gsap.set(headerImgOverlay, {
    // height: 0,
    scale: 1,
    opacity: 1,
    transformOrigin: 'center bottom',
  });

  const headingTl = gsap.timeline({
    onComplete: () => {
      ScrollTrigger.refresh();
    },
  });

  headingTl
    .to(
      headerImg,
      {
        // scale: 1,
        yPercent: 0,
        duration: 1.25,
        ease: 'ease.in',
      },
      'start'
    )
    .to(
      headerImgOverlay,
      {
        scaleY: 0,
        duration: 1.5,
        ease: ease,
      },
      'start'
    )
    .from(
      headerHeading,
      {
        y: isMobileDevice() ? 100 : 200,
        duration: 1,
        autoAlpha: 0,
        ease: ease,
      },
      'start'
    )
    .from(
      headerSubheading,
      {
        y: isMobileDevice() ? 100 : 250,
        duration: 1,
        autoAlpha: 0,
        ease: ease,
      },
      'start'
    )
    .from(
      headerButtons,
      {
        y: isMobileDevice() ? 100 : 350,
        duration: 1,
        autoAlpha: 0,
        ease: ease,
      },
      'start'
    );
}

function animateLine() {
  const line = document.querySelector('[data-element="line"]');
  gsap.set(line, {
    scaleX: 0,
    transformOrigin: 'left center',
  });
  gsap.to(line, {
    scaleX: 1,
    duration: 1,
    scrollTrigger: {
      trigger: line,
      start: 'top 60%',
      once: true,
    },
  });
}

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(CustomEase);
  const lenis = new Lenis({ lerp: 0.1, duration: 1.5 });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  const mouse = {
    x: 0,
    y: 0,
  };

  animateHeader();
  animateLine();
  animateCursor('.cursor_inner', mouse, 0.2);
  animateCursorElements(['[data-element="article-card"]', '[data-element="project"]']);
  animateText('[data-element="text"]');
  animateFadeIn('[data-animation="fade-in"]');
  changeTheme("[data-element='theme-toggle']");
});
