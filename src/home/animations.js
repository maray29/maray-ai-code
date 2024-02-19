/* eslint-disable no-console */
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { debounce } from 'lodash';
import SplitType from 'split-type';

import { isMobileDevice } from '$utils/isMobile';

export function animatePageHeader() {
  gsap.registerPlugin(CustomEase);
  // const logo = document.querySelector('.logo_wrap');
  const headerCta = document.querySelectorAll('[data-element="portfolio-header-cta"]');
  const nav = document.querySelector('[data-element="nav"]');

  const tl = gsap.timeline();

  // const logoSplit = new SplitType(logo, { types: `chars` });
  // this.nestLettersDivs(logoSplit);

  const nameBright = [...document.querySelectorAll('.portfolio_header_name-bright')];
  const mar = nameBright[0];
  const ay = nameBright[1];
  const nameDark = [...document.querySelectorAll('.portfolio_header_name-dark')];
  const tirosyan = nameDark[0];
  const k = nameDark[1];
  const underline = [...document.querySelectorAll('[data-element="underline"]')];
  const headerText = [...document.querySelectorAll('[data-animation="header-text"]')];
  const headerContent = document.querySelector('.portfolio_header_name-wrapper');

  //   gsap.set(headerContent, { perspective: 500 });

  const angle = -30;
  const duration = 2.0;
  const xDistance = -60;

  // const ease = CustomEase.create(
  //   'custom',
  //   'M0,0 C0.134,0.03 0.244,0.09 0.298,0.168 0.395,0.308 0.423,0.682 0.55,0.82 0.631,0.908 0.752,1 1,1 '
  // ),

  const ease = 'power4.out';

  tl.to('.page-wrapper', { autoAlpha: 1 })

    // .from(marSplit.chars, {
    //   xPercent: xDistance,
    //   rotationY: angle,
    //   autoAlpha: 0,
    //   stagger: 0.02,
    //   duration: duration,
    //   ease: ease,
    // })
    // .from(
    //   aySplit.chars,
    //   {
    //     xPercent: xDistance,
    //     rotationY: angle,
    //     autoAlpha: 0,
    //     stagger: 0.02,
    //     duration: duration,
    //     ease: ease,
    //   },
    //   '<'
    // )

    // .from(
    //   tirosyanSplit.chars,
    //   {
    //     xPercent: xDistance,
    //     rotationY: angle,
    //     autoAlpha: 0,
    //     stagger: 0.02,
    //     duration: duration,
    //     ease: ease,
    //   },
    //   '<0.25'
    // )

    // .from(
    //   kSplit.chars,
    //   {
    //     xPercent: xDistance,
    //     rotationY: angle,
    //     autoAlpha: 0,
    //     stagger: 0.05,
    //     duration: duration,
    //     ease: ease,
    //   },
    //   '<'
    // )

    .from(
      underline,
      {
        scaleX: 0,
        duration: 1.25,
        delay: 0.25,
        autoAlpha: 0,
        ease: ease,
      },
      '<'
    )

    .from(
      headerText,
      {
        stagger: 0.2,
        duration: 1.5,
        ease: 'ease.out4',
        autoAlpha: 0,
      },
      '<0.5'
    )

    .from(
      nav,
      {
        autoAlpha: 0,
        duration: 0.5,
        ease: ease,
      },
      '<0.8'
    )

    // .from(logoSplit.chars, {
    //   xPercent: -120,
    //   stagger: 0.1,
    //   duration: 1.0,
    //   ease: 'power.out4',
    //   autoAlpha: 0,
    // })

    .from(
      headerCta,
      {
        ease: 'power.out4',
        autoAlpha: 0,
      },
      '<0.9'
    );

  // window.addEventListener('click', () => {
  //   console.log(' hello');
  //   tl.restart();
  // });
}

export function animateElementsParallax(selector) {
  const parallaxAnimationItems = [...document.querySelectorAll(selector)];

  console.log('Testing animateParallax function. Elements to animate: ', parallaxAnimationItems);

  // console.log(parallaxAnimationItems);
  parallaxAnimationItems.forEach((item) => {
    // console.log(item);
    const speed = item.getAttribute('data-speed');
    const scale = item.getAttribute('data-scale');
    const end = item.getAttribute('data-end');
    gsap.from(item, {
      yPercent: speed ? `${speed * 2}` : 20,
      scale: scale ? 0.95 : 1.0,
      scrollTrigger: {
        trigger: item,
        start: 'top 100%',
        end: `top ${end ? end : 0}%`,
        scrub: true,
      },
    });
  });
}

export function animateProcessText(selector) {
  const processText = [...document.querySelectorAll(selector)];

  processText.forEach((text) => {
    // console.log(text);

    const triggerElement = text;
    const targetElement = new SplitType(text, {
      types: `words`,
    });

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: '0% 90%',
        end: '100% 50%',
        scrub: 0.5,
      },
    });

    tl.fromTo(
      targetElement.words,
      {
        opacity: 0.25,
      },
      {
        opacity: 1,
        stagger: 0.15,
        duration: 0.75,
        ease: 'none',
        delay: 0.25,
      }
    );
  });
}

export function animateFadeInScrub(selector) {
  const elements = [...document.querySelectorAll(selector)];

  elements.forEach((el) => {
    gsap.set(el, {
      autoAlpha: 0.2,
    });
    gsap.to(el, {
      autoAlpha: 1,
      stagger: 0.15,
      duration: 0.75,
      ease: 'power.out4',
      delay: 0.25,
      scrollTrigger: {
        trigger: el,
        start: 'top 60%',
        end: 'top 45%',
        scrub: 1,
        // once: true,
      },
    });
  });
}

export function animateProjectsParallax(selector) {
  const projects = [...document.querySelectorAll(selector)];

  projects.forEach((project) => {
    const speed = project.getAttribute('data-speed');
    gsap.from(project, {
      yPercent: `+${isMobileDevice() ? 0 : speed}`,
      scrollTrigger: {
        trigger: project,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        // markers: true,
      },
    });
  });
}

export function killScrollTriggers() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
}

function nestLettersDivs(text) {
  text.chars.forEach((el) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('char-mask');

    // insert wrapper before el in the DOM tree
    el.parentNode.insertBefore(wrapper, el);
    // move el into wrapper
    wrapper.appendChild(el);
  });
}
