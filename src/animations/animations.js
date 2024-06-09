import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Swiper from 'swiper';

import updatePortfolioPage from '$utils/changeTheme';
import { isMobileDevice, isTouchDevice } from '$utils/isMobile';

export function animateCursorElements(selectors) {
  const elements = selectors.flatMap((selector) => [...document.querySelectorAll(selector)]);

  elements.forEach((el) => {
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

      console.log('active');

      gsap.to(cursorInner, {
        width: textWidth + 20,
        height: textHeight + 10,
        duration: 0.35,
        borderRadius: 0,
      });

      gsap.to(p, {
        autoAlpha: 1,
        delay: 0.25,
      });
    });

    el.addEventListener('mouseleave', () => {
      cursorInner.innerHTML = '';
      cursorInner.classList.remove('is-active');
      gsap.to(cursorInner, {
        width: '1rem',
        height: '1rem',
        borderRadius: 100,
        duration: 0.35,
      });
    });
  });
}

export function animateCursor(cursor, mouse, speed = 0.1) {
  const cursorEl = document.querySelector(cursor);
  //   console.log(cursorEl);
  if (!isMobileDevice() && !isTouchDevice()) {
    gsap.set(cursorEl, {
      //   autoAlpha: 0,
    });
  }

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  // Use a local mouse variable if it's not passed as an argument
  const localMouse = mouse || { x: pos.x, y: pos.y };

  const fpms = 60 / 1000;

  const xSet = gsap.quickSetter(cursorEl, 'x', 'px');
  const ySet = gsap.quickSetter(cursorEl, 'y', 'px');

  gsap.ticker.add((time, deltaTime) => {
    const delta = deltaTime * fpms;
    const dt = 1.0 - Math.pow(1.0 - speed, delta);

    pos.x += (localMouse.x - pos.x) * dt;
    pos.y += (localMouse.y - pos.y) * dt;
    xSet(pos.x + 20);
    ySet(pos.y - 20);
  });

  window.addEventListener('mousemove', (event) => {
    localMouse.x = event.x;
    localMouse.y = event.y;
  });
}

export function animateText(selector) {
  const textElements = [...document.querySelectorAll(selector)];

  textElements.forEach((el) => {
    function splitText(el) {
      return new SplitType(el, {
        types: `lines`,
      });
    }
    let splitTextElement = splitText(el);

    gsap.from(splitTextElement.lines, {
      autoAlpha: 0,
      stagger: 0.1,
      duration: 1.75,
      ease: 'power.out4',
      scrollTrigger: {
        trigger: el,
        start: 'top 70%',
        once: true,
      },
    });

    // let windowWidth = window.innerWidth;
    // window.addEventListener('resize', function () {
    //   if (windowWidth !== window.innerWidth) {
    //     windowWidth = window.innerWidth;
    //     splitTextElement.revert();
    //     splitText();
    //   }
    // });
  });
}

export function animateFadeIn(selector) {
  const elements = [...document.querySelectorAll(selector)];

  elements.forEach((el) => {
    const elType = el.getAttribute('data-element');
    if (elType === 'list') {
      gsap.set(el.children, {
        autoAlpha: 0,
        yPercent: 10,
      });
    } else {
      gsap.set(el, {
        autoAlpha: 0,
        yPercent: 10,
      });
    }
  });

  ScrollTrigger.batch(elements, {
    start: 'top 70%',
    once: true,
    onEnter: (batch) => {
      batch.forEach((el) => {
        const elType = el.getAttribute('data-element');
        if (elType === 'list') {
          // animate children of the element
          gsap.to(el.children, {
            autoAlpha: 1,
            duration: 1,
            yPercent: 0,
            stagger: 0.1,
          });
        } else {
          // animate elements
          gsap.to(batch, {
            autoAlpha: 1,
            duration: 1,
            yPercent: 0,
            stagger: 0.1,
          });
        }
      });
    },
  });
}

export function createTestimonialComponent() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    slideToClickedSlide: true,
    keyboard: true,
    centeredSlides: true,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    navigation: {
      nextEl: '.swiper-next',
      prevEl: '.swiper-prev',
    },
    pagination: {
      el: '.swiper-bullet-wrapper',
      bulletClass: 'swiper-bullet',
      bulletActiveClass: 'is-active',
      bulletElement: 'button',
      clickable: true,
    },
    autoplay: {
      delay: 3000,
    },
    speed: 150,
  });

  const names = document.querySelectorAll("[data-element='testimonial-name']");
  const titles = document.querySelectorAll("[data-element='testimonial-title']");
  const lines = document.querySelectorAll("[data-element='testimonial-line']");
  const texts = document.querySelectorAll("[data-element='testimonial-text']");
  const images = document.querySelectorAll("[data-element='testimonial-image']");

  const swiperPrev = document.querySelector('.swiper-prev');
  const swiperNext = document.querySelector('.swiper-next');

  function animateSwiper(direction) {
    // Not happy with this implementation as a new
    // timeline is created on every button click
    let tl = gsap.timeline();

    tl.fromTo([names, titles], { opacity: 1, yPercent: 0 }, { opacity: 0, yPercent: 200 })
      .fromTo(lines, { scaleX: 1 }, { scaleX: 0 }, '<')
      .fromTo(texts, { autoAlpha: 1 }, { autoAlpha: 0 }, '<')
      .fromTo(images, { autoAlpha: 1 }, { autoAlpha: 0 }, '<')
      .to({}, { duration: 0.1 }, '>')
      .call(() => (direction === 'next' ? swiper.slideNext() : swiper.slidePrev()));
  }

  swiperNext.addEventListener('click', () => animateSwiper('next'));
  swiperPrev.addEventListener('click', () => animateSwiper('prev'));

  swiper.on('slideChangeTransitionEnd', () => {
    gsap.fromTo(
      [names, titles],
      { yPercent: 200, opacity: 0 },
      { opacity: 1, yPercent: 0, ease: 'power4', duration: 1.4 }
    );
    gsap.fromTo(lines, { scaleX: 0 }, { scaleX: 1 }, '<');
    gsap.fromTo(texts, { autoAlpha: 0 }, { autoAlpha: 1 }, '<');
    gsap.fromTo(images, { autoAlpha: 0 }, { autoAlpha: 1 }, '<');
  });
}

export function animateNavDropdown() {
  // const dropdown = document.querySelector('[data-element="nav-dropdown-webdesign"]');
  const dropdown = document.querySelector('[data-element="nav-dropdown"]');
  const dropdownList = dropdown.querySelector('[data-element="nav-dropdown-list"]');
  const dropdownArrow = dropdown.querySelector('[data-element="nav-dropdown-arrow"]');
  if (!dropdown) return;
  const dropdownLinks = dropdown.querySelectorAll('[data-element="nav-dropdown-link"]');
  const dropdownContents = dropdown.querySelectorAll('[data-element="nav-dropdown-content"]');
  const dropdownArticles = dropdown.querySelectorAll('[data-element="nav-dropdown-articles"]');

  const duration = 0.35;
  let mouseLeaveTimeout;

  dropdown.addEventListener('mouseenter', () => {
    clearTimeout(mouseLeaveTimeout);
    gsap.set(dropdownList, { display: 'flex' });
    gsap.to(dropdownList, { autoAlpha: 1, duration: duration });
    gsap.to(dropdownArrow, { rotateZ: 180, duration: duration });
    gsap.to('.main-wrapper, .navigation_component', {
      filter: 'blur(5px)',
    });
  });

  dropdown.addEventListener('mouseleave', () => {
    mouseLeaveTimeout = setTimeout(() => {
      gsap.to(dropdownList, { autoAlpha: 0, duration: duration });
      gsap.to(dropdownArrow, { rotateZ: 0, duration: duration });
      gsap.set(dropdownList, { display: 'none', delay: duration });
      gsap.to('.main-wrapper, .navigation_component', {
        filter: 'blur(0px)',
      });
    }, 150);
  });

  dropdownLinks.forEach((link) => {
    const contentType = link.getAttribute('data-type');
    link.addEventListener('mouseenter', () => {
      dropdownContents.forEach((content) => {
        if (contentType !== content.getAttribute('data-type')) {
          gsap.to(content, { autoAlpha: 0, duration: duration });
          gsap.set(content, {
            display: 'none',
            delay: 0.2,
          });
        } else {
          gsap.set(content, {
            display: 'flex',
            delay: 0.2,
          });
          gsap.to(content, { autoAlpha: 1, duration: duration, delay: duration });
        }
      });
      dropdownArticles.forEach((articles) => {
        if (contentType !== articles.getAttribute('data-type')) {
          gsap.to(articles, { autoAlpha: 0, duration: duration });
          gsap.set(articles, {
            display: 'none',
            delay: 0.2,
          });
        } else {
          gsap.set(articles, {
            display: 'block',
            delay: 0.2,
          });
          gsap.to(articles, { autoAlpha: 1, duration: duration, delay: duration });
        }
      });
    });
  });
}

export function animateProjectColorMode(stage) {
  // Select all project elements with data-element="project"
  const projectElements = document.querySelectorAll('[data-element="project"]');
  // Iterate through each project element
  projectElements.forEach((project) => {
    // Extract the data-color-mode value
    const colorMode = project.getAttribute('data-color-mode');

    // Add mouseenter event listener
    project.addEventListener('mouseenter', () => {
      updateSphereColor('light-mode', stage);
      document.body.setAttribute('data-theme', colorMode);
    });

    // Add mouseout event listener
    project.addEventListener('mouseleave', () => {
      // Retrieve the original theme from localStorage
      const originalTheme = localStorage.getItem('theme');

      // Reset the html/body data-theme attribute to the original value
      if (originalTheme) {
        // document.documentElement.setAttribute('data-theme', originalTheme);
        document.body.setAttribute('data-theme', originalTheme);

        updateSphereColor(originalTheme, stage);
      }
    });
  });
}

function updateSphereColor(theme, stage) {
  const isLightMode = theme === 'light-mode';
  stage.sphere.updateParticleProperties(
    isLightMode ? 0xe6e6e6 : 0x2e2e2e,
    isLightMode ? 2 : 4,
    isLightMode ? 6 : 12
  );
  if (stage.effect1) {
    stage.updateAberrationShader(isLightMode ? 0.001 : 0.35);
  }
  stage.sphere.toggleBlendingMode();
}
