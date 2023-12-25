/* eslint-disable no-console */
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { debounce } from 'lodash';
import SplitType from 'split-type';

export default class PortfolioAnimation {
  DOM = {};
  constructor(container) {
    this.container = container;
  }

  initAnimationsOnPageLoad() {
    gsap.registerPlugin(ScrollTrigger);

    this.animateParallax();
    this.animateNavbar();
    this.animateParagraphs();
    this.animateProcessText();
    this.animateFadeIn();
    this.animateFadeInScrub();
    this.animateProjects();
    this.animateCursorElements();
  }

  killScrollTriggers() {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }

  animateNavbar() {
    gsap.registerPlugin(CustomEase);
    const logo = document.querySelector('.logo_wrap');
    const navContact = document.querySelector('.nav_contact');
    const navContactSubtitle = document.querySelector('.nav_contact-subtitle-2');
    const headerCta = document.querySelectorAll('[data-element="portfolio-header-cta"]');

    const tl = gsap.timeline();

    const logoSplit = new SplitType(logo, { types: `chars` });
    this.nestLettersDivs(logoSplit);

    const nameBright = [...document.querySelectorAll('.portfolio_header_name-bright')];
    const mar = nameBright[0];
    const ay = nameBright[1];
    const nameDark = [...document.querySelectorAll('.portfolio_header_name-dark')];
    const tirosyan = nameDark[0];
    const k = nameDark[1];

    const marSplit = new SplitType(mar, { types: `chars` });
    this.nestLettersDivs(marSplit);

    const aySplit = new SplitType(ay, { types: `chars` });
    this.nestLettersDivs(aySplit);

    const tirosyanSplit = new SplitType(tirosyan, { types: `chars` });
    this.nestLettersDivs(tirosyanSplit);

    const kSplit = new SplitType(k, { types: `chars` });
    this.nestLettersDivs(kSplit);

    const underline = [...document.querySelectorAll('[data-animation="underline"]')];
    const headerText = [...document.querySelectorAll('[data-animation="header-text"]')];

    // const nameSplit = new SplitType(name, { types: `chars` })
    // this.nestLettersDivs(nameSplit)
    // const brightLetters = []
    // const darkLetters = []

    const headerContent = document.querySelector('.portfolio_header_name-wrapper');

    gsap.set(headerContent, { perspective: 500 });

    const angle = -30;
    const duration = 2.0;
    const xDistance = -60;
    // const ease = CustomEase.create(
    //   'custom',
    //   'M0,0 C0.134,0.03 0.244,0.09 0.298,0.168 0.395,0.308 0.423,0.682 0.55,0.82 0.631,0.908 0.752,1 1,1 '
    // ),

    const ease = 'power4.out';

    tl.to('.page-wrapper', { autoAlpha: 1 })

      .from(marSplit.chars, {
        xPercent: xDistance,
        rotationY: angle,
        autoAlpha: 0,
        stagger: 0.02,
        duration: duration,
        ease: ease,
      })
      .from(
        aySplit.chars,
        {
          xPercent: xDistance,
          rotationY: angle,
          autoAlpha: 0,
          stagger: 0.02,
          duration: duration,
          ease: ease,
        },
        '<'
      )

      .from(
        tirosyanSplit.chars,
        {
          xPercent: xDistance,
          rotationY: angle,
          autoAlpha: 0,
          stagger: 0.02,
          duration: duration,
          ease: ease,
        },
        '<0.25'
      )

      .from(
        kSplit.chars,
        {
          xPercent: xDistance,
          rotationY: angle,
          autoAlpha: 0,
          stagger: 0.05,
          duration: duration,
          ease: ease,
        },
        '<'
      )

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
        '.portfolio_nav',
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

  animateParallax() {
    const parallaxAnimationItems = [...document.querySelectorAll('[data-animation="parallax"]')];

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

  nestLettersDivs(text) {
    text.chars.forEach((el) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('char-mask');

      // insert wrapper before el in the DOM tree
      el.parentNode.insertBefore(wrapper, el);
      // move el into wrapper
      wrapper.appendChild(el);
    });
  }

  projectLinkMouseEnter(link) {
    const projectLinks = [...document.querySelectorAll('.project_link')];
    const otherProjects = projectLinks.filter((project) => project !== link);
    gsap.to(otherProjects, {
      opacity: 0.25,
      duration: 0.25,
      ease: 'power2.out',
    });

    const projectHeading = link.querySelector('.project_heading');
  }

  projectLinkMouseLeave(link) {
    const projectLinks = [...document.querySelectorAll('.project_link')];
    const otherProjects = projectLinks.filter((project) => project !== link);
    gsap.to(otherProjects, {
      opacity: 1.0,
      duration: 0.25,
      // ease: 'power2.out',
    });

    const projectHeading = link.querySelector('.project_heading');
  }

  animateProcessText() {
    // gsap.registerPlugin(ScrollTrigger);

    const processText = [...document.querySelectorAll('[data-animation="words"]')];

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

      // console.log(targetElement.words);

      // tl.from(targetElement.words, {
      //   autoAlpha: 0.25,
      // });

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

  animateFadeInScrub() {
    const elements = [...document.querySelectorAll('[data-animation="fade-in-scrub"]')];

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

  animateParagraphs() {
    const paragraphs = [...document.querySelectorAll('[data-animation="paragraph"]')];

    paragraphs.forEach((paragraph) => {
      const splitParagraphs = new SplitType(paragraph, {
        types: `lines`,
      });

      gsap.from(splitParagraphs.lines, {
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.75,
        ease: 'power.out4',
        delay: 0.5,
        scrollTrigger: {
          trigger: paragraph,
          start: 'top 65%',
          once: true,
        },
      });
    });
  }

  animateCursorElements() {
    const articleCards = [...document.querySelectorAll('[data-element="article-card"]')];
    const projects = [...document.querySelectorAll('[data-element="project"]')];

    //TODO - merge arrays
    const allElements = [...articleCards, ...projects];

    allElements.forEach((el) => {
      const cursorInner = document.querySelector('.cursor_inner');
      const text = el.getAttribute('data-text');

      el.addEventListener('mouseenter', () => {
        const p = document.createElement('p');
        p.textContent = text;
        p.classList.add('cursor_text');

        gsap.set(p, {
          autoAlpha: 0,
        });

        cursorInner.appendChild(p);
        const textWidth = p.getBoundingClientRect().width;
        const textHeight = p.getBoundingClientRect().height;

        cursorInner.classList.add('is-active');

        gsap.to(cursorInner, {
          width: textWidth + 20,
          height: textHeight + 10,
          duration: 0.35,
        });

        gsap.to(p, {
          autoAlpha: 1,
          delay: 0.1,
        });
      });

      el.addEventListener('mouseleave', () => {
        cursorInner.innerHTML = '';
        cursorInner.classList.remove('is-active');
        gsap.to(cursorInner, {
          width: '1rem',
          height: '1rem',
          duration: 0.35,
        });
      });
    });
  }

  animateProjects() {
    const projects = [...document.querySelectorAll('[data-element="project"]')];

    projects.forEach((project) => {
      const speed = project.getAttribute('data-speed');
      gsap.from(project, {
        yPercent: `+${speed}`,
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

  animateFadeIn() {
    const fadeInElements = [...document.querySelectorAll('[data-animation="fade-in"]')];

    fadeInElements.forEach((el) => {
      gsap.set(el, {
        autoAlpha: 0.2,
        onComplete: () => {
          // console.log('blyaaaaaaaaaaaaaat');
        },
      });
    });
    ScrollTrigger.batch(fadeInElements, {
      start: 'top 60%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          autoAlpha: 1,
          stagger: 0.2,
          // delay: 0.4,
        });
      },
    });
  }
}
