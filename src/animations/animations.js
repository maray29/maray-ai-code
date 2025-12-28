import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Swiper from 'swiper';

import detectDevice from '$utils/detectDevice';
import { isMobileDevice } from '$utils/isMobile';

export function animateCursorElements() {
  const elements = [...document.querySelectorAll('[data-text]')];
  const cursorInner = document.querySelector('.cursor_inner');

  elements.forEach((el) => {
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

export function animateCursor(mouse, speed = 0.1) {
  const cursorEl = document.querySelector('.cursor_inner');
  if (!cursorEl) return;

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

export function animateText() {
  const textElements = [...document.querySelectorAll('[data-element="text"]')];

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
            duration: 0.75,
            yPercent: 0,
            stagger: 0.1,
          });
        } else {
          // animate elements
          gsap.to(batch, {
            autoAlpha: 1,
            duration: 0.75,
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
  const dropdowns = document.querySelectorAll('[data-element="nav-dropdown"]');
  if (dropdowns.length === 0) return;

  dropdowns.forEach((dropdown) => {
    const dropdownList = dropdown.querySelector('[data-element="nav-dropdown-list"]');
    const dropdownArrow = dropdown.querySelector('[data-element="nav-dropdown-arrow"]');

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
    });

    dropdown.addEventListener('mouseleave', () => {
      mouseLeaveTimeout = setTimeout(() => {
        gsap.to(dropdownList, { autoAlpha: 0, duration: duration });
        gsap.to(dropdownArrow, { rotateZ: 0, duration: duration });
        gsap.set(dropdownList, { display: 'none', delay: duration });
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
  });
}

export function animateProjectColorMode(stage) {
  // Select all project elements with data-element="project"
  const projectElements = document.querySelectorAll('[data-element="project"]');
  // Iterate through each project element

  const { isTouchDevice } = detectDevice();
  if (isTouchDevice) return;

  projectElements.forEach((project) => {
    // Extract the data-color-mode value
    const colorMode = project.getAttribute('data-color-mode');

    if (!colorMode) return;

    // Add mouseenter event listener
    project.addEventListener('mouseenter', () => {
      if (colorMode !== 'dark-mode') {
        updateSphereColor('light-mode', stage);
      }
      // updateSphereColor('light-mode', stage);
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

        if (colorMode !== 'dark-mode') {
          updateSphereColor(originalTheme, stage);
        }
      }
    });
  });
}
export function animatePageFadeIn() {
  gsap.to('.page-wrapper', { autoAlpha: 1, duration: 1 });
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

export function animatePageHeader() {
  gsap.registerPlugin(CustomEase);
  // const logo = document.querySelector('.logo_wrap');
  const headerCta = document.querySelectorAll('[data-element="home-header-cta"]');
  const nav = document.querySelector('[data-element="nav"]');
  const underline = [...document.querySelectorAll('[data-element="underline"]')];
  const divider = document.querySelector('.divider');
  const headerText = [...document.querySelectorAll('[data-animation="header-text"]')];
  const logoLetters = document.querySelectorAll('.logo-letter');
  const navigationComponent = document.querySelector('[data-element="navigation-component"]');

  const angle = -30;
  const duration = 1.5;
  const xDistance = -60;

  const tl = gsap.timeline();

  const ease = 'power4.out';

  tl.to('.page-wrapper', { autoAlpha: 1 })

    .from(logoLetters, {
      xPercent: xDistance,
      rotationY: angle,
      autoAlpha: 0,
      stagger: 0.05,
      duration: duration,
      ease: ease,
    })
    .from(
      underline,
      {
        scaleX: 0,
        duration: 1.25,
        autoAlpha: 0,
        delay: 0.25,
        ease: ease,
      },
      '<'
    )
    .from(
      divider,
      {
        autoAlpha: 0,
      },
      '<0.25'
    )

    .from(
      headerText,
      {
        stagger: 0.2,
        duration: 1.5,
        autoAlpha: 0,
        ease: ease,
      },
      '<0.25'
    )

    .from(
      [nav, headerCta],
      {
        autoAlpha: 0,
        ease: ease,
      },
      '<0.25'
    )
    .from(
      navigationComponent,
      {
        autoAlpha: 0,
      },
      '<0.25'
    );
}

export function animateElementsParallax(selector) {
  const parallaxAnimationItems = [...document.querySelectorAll(selector)];

  parallaxAnimationItems.forEach((item) => {
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
        start: '0% 90%',
        end: '100% 50%',
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

export function nestLettersDivs(text) {
  text.chars.forEach((el) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('char-mask');

    // insert wrapper before el in the DOM tree
    el.parentNode.insertBefore(wrapper, el);
    // move el into wrapper
    wrapper.appendChild(el);
  });
}

export function animateLightBeams() {
  const beams = gsap.utils.toArray('[data-element="svg-light-beams"] svg g rect');

  // Start fully visible
  gsap.set(beams, { attr: { 'fill-opacity': 1 } });

  beams.forEach((beam) => {
    // Spread delays across ~10 seconds so only 3-5 animate at once
    const delay = Math.random() * 40;
    const duration = 10 + Math.random() * 1;

    gsap.to(beam, {
      attr: { 'fill-opacity': 'random(0.1, .5)' },
      attr: { width: 0 },
      duration: duration,
      delay: delay,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    gsap.to(beam, {
      y: 'random(0, 50)',
      ease: 'sine.inOut',
      duration: 3,
      repeat: -1,
      delay: 'random(0.25, 1)',
      yoyo: true,
    });
  });
}
