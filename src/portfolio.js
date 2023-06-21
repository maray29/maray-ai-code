import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import PortfolioAnimation from './PortfolioAnimation.js';
import Stage from './Stage.js';

class App {
  lenis;
  plane;
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
      cursor1: document.querySelector('.cursor-inner'),
      cursor2: document.querySelector('.cursor-outer'),
    },
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

  init() {
    this.createStage();
    this.createLenis();
    this.preventReloading();
    this.createEventListeners();
    this.animateCursor(this.DOM.mouse.cursor1, 0.2);
    this.animateCursor(this.DOM.mouse.cursor2, 0.1);

    const container = document.querySelector('main');

    this.homePageAnimation = new PortfolioAnimation(container);
    this.homePageAnimation.initAnimationsOnPageLoad();
  }

  async createStage() {
    const container = document.querySelector('.canvas-container');

    // Init three.js
    this.stage = new Stage(container);
  }

  createLenis() {
    this.lenis = new Lenis({
      duration: 2.5,
      // normalizeWheel: true,
      // syncTouch: true,
    });

    this.lenis.on('scroll', ({ scroll }) => {
      // update our scroll manager values
      // this.stage.updateScrollValues(scroll)
      if (this.stage) {
        this.stage.animateOnScroll(0, scroll);
      }
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    console.log('Lenis: ', this.lenis);
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
        autoAlpha: 0,
      });
    }

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    console.log('Cursor: ', cursor);

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
      xSet(pos.x);
      ySet(pos.y);
    });
  }

  onMouseMove(event) {
    this.mouse.x = event.x;
    this.mouse.y = event.y;
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

  createEventListeners() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
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

  if (document.readyState === 'loading') {
    // Loading hasn't finished yet
    // console.log(`DOM hasn't loaded`);
  } else {
    // `DOMContentLoaded` has already fired
    // console.log(`DOM has loaded`);
    window.APP = new App('#app', {
      debug: window.location.hash.includes('debug'),
    });
  }
});
