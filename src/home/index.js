/* eslint-disable no-return-assign */
import 'swiper/css';

import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import changeTheme from '$utils/changeTheme';

import { createTestimonialComponent } from '../animations/animations';
import PortfolioAnimation from '../PortfolioAnimation.js';
import Stage from '../Stage.js';

class App {
  lenis;
  plane;
  stage;

  DOM = {
    container: document.querySelector('.canvas-container'),
    itemsWrapper: document.querySelector('.projects_list'),
    homeHeader: document.querySelector('[data-element="home-header"]'),
    home: {
      el: document.querySelector('.projects_list'),
    },
    project: {
      el: document.querySelector('.project_cover'),
    },
    mouse: {
      cursor1: document.querySelector('.cursor_inner'),
      cursor2: document.querySelector('.cursor_outer'),
    },
    cards: document.querySelectorAll('.wf_process-card_component'),
    toggle: "[data-element='theme-toggle']",
    navigationComponent: document.querySelector('[data-element="navigation-component"]'),
    navigationLink: '[data-element="navigation-link"]',
    navigationLinkText: '[data-element="navigation-link-text"]',
    navigationLinkIcon: '[data-element="navigation-icon"]',
  };

  constructor() {
    this.scrollThreshold = 5;
    this.mouse = {
      x: 0,
      y: 0,
    };

    this.isFirstLoad = true;
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    this.init();
    // this.isFirstLoad = false
  }

  async init() {
    await this.createStage();
    this.createLenis();
    this.preventReloading();
    this.createEventListeners();
    this.animateCursor(this.DOM.mouse.cursor1, 0.2);
    // this.animateCursor(this.DOM.mouse.cursor2, 0.1);
    // this.animateCards(this.DOM.cards);
    this.changeTheme(this.DOM.toggle, this.stage);
    this.createTestimonialComponent();
    this.animateNavigationComponent();
    this.createScrollTo();

    const container = document.querySelector('main');

    this.homePageAnimation = new PortfolioAnimation(container);
    this.homePageAnimation.initAnimationsOnPageLoad();
  }

  createTestimonialComponent() {
    createTestimonialComponent();
  }

  changeTheme(button, stage) {
    changeTheme(button, stage);
  }

  animateNavigationComponent() {
    if (!this.DOM.navigationComponent) return;
    let isCollapsed = false;
    gsap.to(this.DOM.navigationComponent, {
      width: '3rem',
      scrollTrigger: {
        trigger: this.DOM.homeHeader,
        start: 'bottom center',
        toggleActions: 'play none none reverse',
        onEnter: () => (isCollapsed = true),
        onLeaveBack: () => (isCollapsed = false),
      },
    });

    this.DOM.navigationComponent.addEventListener('mouseenter', () => {
      if (isCollapsed) {
        gsap.to(this.DOM.navigationComponent, {
          width: 'auto',
        });
      }
    });

    this.DOM.navigationComponent.addEventListener('mouseleave', () => {
      if (isCollapsed) {
        gsap.to(this.DOM.navigationComponent, {
          width: '3rem',
          delay: 0.25,
        });
      }
    });

    const links = this.DOM.navigationComponent.querySelectorAll(this.DOM.navigationLink);
    links.forEach((link) => {
      const linkIcon = link.querySelector(this.DOM.navigationLinkIcon);
      const linkText = link.querySelector(this.DOM.navigationLinkText);
      gsap.set(linkIcon, {
        // display: 'none',
        xPercent: -100,
        autoAlpha: 0,
      });
      gsap.set(linkText, {
        x: -24,
      });
      link.addEventListener('mouseenter', () => {
        gsap.to(linkIcon, {
          // display: 'block',
          xPercent: 0,
          autoAlpha: 1,
        });
        gsap.to(linkText, {
          x: 0,
        });
      });
      link.addEventListener('mouseleave', () => {
        gsap.to(linkIcon, {
          xPercent: -100,
          autoAlpha: 0,
        });
        gsap.to(linkText, {
          x: -25,
        });
      });
    });
  }

  createScrollTo() {
    // Remember: if you scroll to an element and also animate it,
    // then the offset will be calculated with an error.
    const sections = gsap.utils.toArray(document.querySelectorAll('[data-section]'));
    const links = gsap.utils.toArray(document.querySelectorAll('[data-link]'));

    for (let i = 0; i < sections.length; i++) {
      for (let j = 0; j < links.length; j++) {
        if (sections[i].getAttribute('data-section') === links[j].getAttribute('data-link')) {
          const pair = {
            section: sections[i],
            link: links[j],
          };
          console.log(pair);

          ScrollTrigger.create({
            trigger: pair.section,
            start: 'top 60%',
            end: 'bottom 40%',
            toggleClass: { targets: pair.link, className: 'is-active' },
          });

          pair.link.addEventListener('click', (e) => {
            e.preventDefault();
            gsap.to(window, {
              duration: 1.5,
              scrollTo: { y: pair.section, offsetY: 80 },
              ease: 'power2.inOut',
              overwrite: 'auto',
            });
          });
        }
      }
    }
  }

  // Init three.js
  async createStage() {
    const container = document.querySelector('.canvas-container');
    const currentTheme = localStorage.getItem('theme') || 'dark-mode';

    if (currentTheme === 'light-mode') {
      this.stage = new Stage(container, {
        aberration: 0.001,
      });
    } else {
      this.stage = new Stage(container, {
        aberration: 0.35,
      });
    }
  }

  createLenis() {
    this.lenis = new Lenis({
      duration: 1.5,
      // normalizeWheel: true,
      // syncTouch: true,
    });

    this.lenis.on('scroll', ({ scroll }) => {
      ScrollTrigger.update();
      // update our scroll manager values
      // this.stage.updateScrollValues(scroll)
      if (this.stage) {
        this.stage.animateOnScroll(0, scroll);
        // console.log(scroll);
      }
    });

    // this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  isTouchDevice() {
    return (
      'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    );
  }

  animateCursor(cursor, speed = 0.1) {
    // let mm = gsap.matchMedia();

    // // add a media query. When it matches, the associated function will run
    // mm.add('(max-width: 768px)', () => {
    //   // this setup code only runs when viewport is at least 800px wide
    //   gsap.set(cursor, {
    //     autoAlpha: 0,
    //   });
    // });

    if (!this.isMobileDevice() && !this.isTouchDevice()) {
      gsap.set(cursor, {
        // autoAlpha: 0,
        // x: '20px',
        // y: '-20px',
        // xPercent: 50,
        // yPercent: -100,
      });
    }

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mouse = { x: pos.x, y: pos.y };

    const fpms = 60 / 1000;

    const xSet = gsap.quickSetter(cursor, 'x', 'px');
    const ySet = gsap.quickSetter(cursor, 'y', 'px');

    gsap.ticker.add((time, deltaTime) => {
      const delta = deltaTime * fpms;
      const dt = 1.0 - Math.pow(1.0 - speed, delta);

      pos.x += (this.mouse.x - pos.x) * dt;
      pos.y += (this.mouse.y - pos.y) * dt;
      xSet(pos.x + 20);
      ySet(pos.y - 20);
    });
  }

  onMouseMove(event) {
    this.mouse.x = event.x;
    this.mouse.y = event.y;
  }

  createEventListeners() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  preventReloading() {
    // Prevent reloading the same page
    const links = document.querySelectorAll('a[href]');
    const cbk = (e) => {
      if (e.currentTarget.href === window.location.href) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener('click', cbk);
    }
  }

  // Getter methods for document and window properties
  get documentHeight() {
    return document.documentElement.scrollHeight;
  }

  get viewportHeight() {
    return window.innerHeight;
  }

  get scrollPosition() {
    return window.scrollY;
  }
}

window.Webflow ||= [];
window.Webflow.push(() => {
  // console.clear()
});

window.addEventListener('DOMContentLoaded', () => {
  window.APP = new App('#app', {
    debug: window.location.hash.includes('debug'),
  });
});
