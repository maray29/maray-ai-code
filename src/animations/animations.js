import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Swiper from 'swiper';

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
        start: 'top 60%',
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
    start: 'top 60%',
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
      .to({}, { duration: 0.25 }, '>')
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
