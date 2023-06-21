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

  window.addEventListener('click', () => {
    headingTl.restart();
  });

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
      yPercent: 80,
      duration: 1.2,
      autoAlpha: 0,
      ease: ease,
    },
    'start'
  );

  // Scroll based animations
  let mm = gsap.matchMedia(),
    breakPoint = 768;

  mm.add(
    {
      // set up any number of arbitrarily-named conditions. The function below will be called when ANY of them match.
      isDesktop: `(min-width: ${breakPoint}px)`,
      isMobile: `(max-width: ${breakPoint - 1}px)`,
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      // context.conditions has a boolean property for each condition defined above indicating if it's matched or not.
      let { isDesktop, isMobile, reduceMotion } = context.conditions;

      gsap.to(
        bgImg,
        {
          yPercent: isDesktop ? -10 : -5,
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
        yPercent: isDesktop ? -40 : -20,
        duration: 1,
        scrollTrigger: {
          trigger: '.portfolio_nav',
          start: 'top top',
          end: '+300%',
          scrub: true,
        },
      });

      return () => {
        // optionally return a cleanup function that will be called when none of the conditions match anymore (after having matched)
        // it'll automatically call context.revert() - do NOT do that here . Only put custom cleanup code here.
      };
    }
  );

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
