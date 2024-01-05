import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

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
  console.log(cursorEl);
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
    mouse.x = event.x;
    mouse.y = event.y;
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
