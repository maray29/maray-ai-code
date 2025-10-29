/* eslint-disable no-return-assign */
import 'swiper/css';

import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  animateCursor,
  animateCursorElements,
  animateFadeIn,
  animateNavDropdown,
  animateProjectColorMode,
  animateText,
  createTestimonialComponent,
} from '$animations/animations';
import {
  animateFadeInScrub,
  animatePageHeader,
  animateProcessText,
  animateProjectsParallax,
} from '$animations/animations';
import changeTheme from '$utils/changeTheme';

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
      cursor1: '.cursor_inner',
      cursor2: '.cursor_outer',
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

    // this.animateCursor(this.DOM.mouse.cursor2, 0.1);
    // this.animateCards(this.DOM.cards);
    this.changeTheme(this.DOM.toggle, this.stage);
    this.createTestimonialComponent();
    this.animateNavigationComponent();
    this.createScrollTo();

    // Refactored functions
    const mouse = {
      x: 0,
      y: 0,
    };

    animateCursor(mouse, 0.2);
    animateCursorElements();
    animatePageHeader();
    animateFadeIn('[data-animation="fade-in"]');
    animateText();
    animateProcessText('[data-animation="words"]');
    animateFadeInScrub('[data-animation="fade-in-scrub"]');
    animateProjectsParallax('[data-element="project"]');
    animateNavDropdown();
    animateProjectColorMode(this.stage);
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
      backgroundColor: 'transparent',
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
          backgroundColor: 'var(--colors--background--bg-primary)',
        });
      }
    });

    this.DOM.navigationComponent.addEventListener('mouseleave', () => {
      if (isCollapsed) {
        gsap.to(this.DOM.navigationComponent, {
          width: '3rem',
          delay: 0.25,
          backgroundColor: 'transparent',
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
              scrollTo: { y: pair.section, offsetY: 0 },
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
