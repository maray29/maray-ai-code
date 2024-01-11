import './portfolio.css';
import '$utils/htmx-variable.js';

import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import changeTheme from '$utils/changeTheme';

import PortfolioAnimation from '../PortfolioAnimation.js';
import Stage from '../Stage.js';

class App {
  lenis;
  plane;
  stage;

  DOM = {
    container: document.querySelector('.canvas-container'),
    itemsWrapper: document.querySelector('.projects_list'),
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
  };

  constructor() {
    this.scrollThreshold = 5;
    this.mouse = {
      x: 0,
      y: 0,
    };

    this.isFirstLoad = true;
    gsap.registerPlugin(ScrollTrigger);
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
    this.animateCards(this.DOM.cards);
    this.changeTheme(this.DOM.toggle, this.stage);

    const container = document.querySelector('main');

    this.homePageAnimation = new PortfolioAnimation(container);
    this.homePageAnimation.initAnimationsOnPageLoad();
  }

  changeTheme(button, stage) {
    changeTheme(button, stage);
  }

  animateCards(cards) {
    const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 20,
      gap: 32,
      vertical: false,
      opacity: 0,
    };

    const PROXIMITY = 10;

    const UPDATE = (event) => {
      // get the angle based on the center point of the card and pointer position
      for (const CARD of cards) {
        // Check the card against the proximity and then start updating
        const CARD_BOUNDS = CARD.getBoundingClientRect();
        // Get distance between pointer and outerbounds of card
        if (
          event?.x > CARD_BOUNDS.left - CONFIG.proximity &&
          event?.x < CARD_BOUNDS.left + CARD_BOUNDS.width + CONFIG.proximity &&
          event?.y > CARD_BOUNDS.top - CONFIG.proximity &&
          event?.y < CARD_BOUNDS.top + CARD_BOUNDS.height + CONFIG.proximity
        ) {
          // If within proximity set the active opacity
          CARD.style.setProperty('--active', 1);
        } else {
          CARD.style.setProperty('--active', CONFIG.opacity);
        }
        const CARD_CENTER = [
          CARD_BOUNDS.left + CARD_BOUNDS.width * 0.5,
          CARD_BOUNDS.top + CARD_BOUNDS.height * 0.5,
        ];
        let ANGLE =
          (Math.atan2(event?.y - CARD_CENTER[1], event?.x - CARD_CENTER[0]) * 180) / Math.PI;
        ANGLE = ANGLE < 0 ? ANGLE + 360 : ANGLE;
        CARD.style.setProperty('--start', ANGLE + 90);
      }
    };

    document.body.addEventListener('pointermove', UPDATE);
    UPDATE();
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
