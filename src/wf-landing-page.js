import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { doc } from 'prettier';
import SplitType from 'split-type';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(CustomEase);
  const lenis = new Lenis({ lerp: 0.1, duration: 2.5 });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  const isMobile = isMobileDevice();

  const bgImg = document.querySelector('.header_bg-img');
  const bgWrap = document.querySelector('.header_bg-wrap');
  const h1 = document.querySelector('h1');
  const subHeading = document.querySelector('[data-element="subheading"]');
  const buttonRow = document.querySelector('[data-element="button-row"]');
  const headerContent = document.querySelector('.header_content');
  const blogPost = document.querySelector('[data-element="blog-post"]');
  const readLabel = blogPost.querySelector('[data-element="blog-post-read"]');
  const blogPostImg = blogPost.querySelector('.wf_blog-post_img');

  const ease = CustomEase.create(
    'custom',
    'M0,0 C0.134,0.03 0.244,0.09 0.298,0.168 0.395,0.308 0.423,0.682 0.55,0.82 0.631,0.908 0.752,1 1,1 '
  );

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
    opacity: 1,
    transformOrigin: 'center bottom',
  });

  const headingTl = gsap.timeline();

  // window.addEventListener('click', () => {
  //   headingTl.restart();
  // });

  headingTl.to(
    bgImg,
    {
      // scale: 1,
      yPercent: 0,
      duration: 1,
      ease: 'ease.in',
    },
    'start'
  );

  headingTl.to(
    '.overlay',
    {
      scaleY: 0,
      // autoAlpha: 1,
      // height: '0%',
      duration: 1.5,
      ease: ease,
    },
    'start+=0.2'
  );

  const headingSplit = new SplitType(h1, { types: 'words, lines' });

  headingTl.from(
    headerContent,
    {
      yPercent: isMobile ? 60 : 80,
      duration: 1.2,
      autoAlpha: 0,
      ease: ease,
    },
    'start'
  );

  // Scroll based animations

  console.log('++++++++++++++++', isMobileDevice());

  // gsap.to(
  //   bgImg,
  //   {
  //     yPercent: isMobile ? 0 : -10,
  //     scrollTrigger: {
  //       trigger: bgImg,
  //       start: 'top 30%',
  //       end: 'bottom top',
  //       scrub: true,
  //     },
  //   },
  //   'start'
  // );

  // gsap.to(headerContent, {
  //   yPercent: isMobile ? 0 : -20,
  //   duration: 1,
  //   scrollTrigger: {
  //     trigger: headerContent,
  //     start: 'top top',
  //     end: 'bottom top',
  //     scrub: true,
  //   },
  // });

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
