import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { doc } from 'prettier';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  const lenis = new Lenis({ lerp: 0.1 });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  const bgImg = document.querySelector('.header_bg-img');
  const bgWrap = document.querySelector('.header_bg-wrap');
  const h1 = document.querySelector('h1');
  const subHeading = document.querySelector('[data-element="subheading"]');
  const buttonRow = document.querySelector('[data-element="button-row"]');
  const headerContent = document.querySelector('.header_content');
  const blogPost = document.querySelector('[data-element="blog-post"]');
  const readLabel = blogPost.querySelector('[data-element="blog-post-read"]');
  const blogPostImg = blogPost.querySelector('.wf_blog-post_img');

  gsap.to('.page-wrapper', {
    autoAlpha: 1,
  });

  gsap.set(bgImg, {
    scale: 1.2,
    yPercent: 20,
  });

  // gsap.from(bgWrap, {
  //   height: 0,
  //   duration: 1,
  //   transformOrigin: 'center top',
  // });

  gsap.set('.overlay', {
    // height: 0,
    scale: 1,
    transformOrigin: 'center bottom',
  });

  const headingTl = gsap.timeline();

  headingTl.to(
    bgImg,
    {
      // scale: 1,
      yPercent: 0,
      duration: 1,
    },
    'start'
  );

  headingTl.to(
    '.overlay',
    {
      scaleY: 0,
      // height: '0%',
      duration: 1,
    },
    'start'
  );

  const headingSplit = new SplitType(h1, { types: 'words, lines' });

  // headingTl.from(
  //   headingSplit.words,
  //   {
  //     yPercent: 120,
  //     stagger: 0.05,
  //     duration: 0.7,
  //     //   delay: 0.2,
  //     autoAlpha: 0,
  //     ease: 'ease.in',
  //     onComplete: function () {
  //       headingSplit.revert();
  //     },
  //   },
  //   'start'
  // );

  headingTl.from(
    headerContent,
    {
      yPercent: 150,
      duration: 0.7,
      autoAlpha: 0,
      ease: 'ease.in',
    },
    'start'
  );

  // headingTl.from(
  //   subHeading,
  //   {
  //     yPercent: 100,
  //     opacity: 0,
  //     delay: 0.4,
  //   },
  //   '<'
  // );
  // headingTl.from(
  //   buttonRow,
  //   {
  //     yPercent: 100,
  //     opacity: 0,
  //     delay: 0.2,
  //   },
  //   '<'
  // );

  // Scroll based animations

  gsap.to(
    bgImg,
    {
      y: -600,
      scale: 0.9,
      scrollTrigger: {
        trigger: bgImg,
        start: 'top 30%',
        end: 'bottom top',
        scrub: true,
      },
    },
    'start'
  );

  gsap.to(headerContent, {
    y: -100,
    duration: 1,
    scrollTrigger: {
      trigger: headerContent,
      start: 'top 30%',
      end: 'bottom top',
      scrub: true,
    },
  });

  blogPost.addEventListener('mouseover', () => {
    console.log(' I am over ');
    gsap.to(readLabel, {
      color: '#15d86d',
      // x: 10,
    });
    gsap.to(blogPostImg, {
      scale: 1.03,
    });
  });
  blogPost.addEventListener('mouseleave', () => {
    console.log(' I leave ');
    gsap.to(readLabel, {
      color: '#c4c4c4',
      // x: 0,
    });
    gsap.to(blogPostImg, {
      scale: 1,
    });
  });
});
