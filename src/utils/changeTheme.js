import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LIGHT_MODE = 'light-mode';
const DARK_MODE = 'dark-mode';
const PORTFOLIO_PATH = '/portfolio';
const CSS_URL =
  'https://cdn.jsdelivr.net/npm/@maray-ai/maray-ai-code@2.0.2/dist/css/color-modes.css';

let currentTheme = localStorage.getItem('theme') || DARK_MODE; // Global scope
let colorThemes = null; // Global variable to store color themes

export default async function changeTheme(selector, stage) {
  const button = document.querySelector(selector);
  // console.log('Toggle button: ', button);
  document.body.setAttribute('data-theme', currentTheme);

  button.addEventListener('change', () => toggleTheme(stage));

  applyTheme();
}

async function toggleTheme(stage) {
  currentTheme = document.body.getAttribute('data-theme') === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
  updatePageForTheme(currentTheme, stage);
  document.body.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);

  await applyTheme();
}

async function applyTheme() {
  try {
    if (!colorThemes) {
      colorThemes = await fetchColorThemes(CSS_URL);
    }
    animateColorTransitions(colorThemes, currentTheme);
  } catch (error) {
    console.error('Error fetching color themes:', error);
  }
}

function updatePageForTheme(theme, stage) {
  if (window.location.pathname === PORTFOLIO_PATH && stage) {
    updatePortfolioPage(theme, stage);
  }
}

function updatePortfolioPage(theme, stage) {
  const isLightMode = theme === LIGHT_MODE;
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

async function fetchColorThemes(url) {
  if (!colorThemes) {
    const response = await fetch(url);
    const cssText = await response.text();
    const styleEl = document.createElement('style');
    styleEl.textContent = cssText;
    document.head.appendChild(styleEl);

    colorThemes = {};
    const htmlStyles = getComputedStyle(document.documentElement);
    const regex = /--([^:\s]+):\s*var\(--([^)]+)\);/g;

    if (styleEl.sheet) {
      const rules = styleEl.sheet.cssRules;
      for (const rule of rules) {
        const themeMatch = rule.selectorText.match(
          /\[data-theme=['"]?(light-mode|dark-mode)['"]?\]/
        );
        if (themeMatch) {
          const theme = themeMatch[1];
          colorThemes[theme] = colorThemes[theme] || {};

          let match;
          while ((match = regex.exec(rule.cssText)) !== null) {
            const key = `--${match[1]}`;
            const value = htmlStyles.getPropertyValue(`--${match[2]}`);
            colorThemes[theme][key] = value;
          }
        }
      }
    }
  }
  return colorThemes;
}

function animateColorTransitions(colorThemes, currentTheme) {
  const triggerElements = document.querySelectorAll('[data-animate-to]');
  // Store original CSS variables
  // const originalStyles = {};
  // for (let key in colorThemes[theme]) {
  //   originalStyles[key] = getComputedStyle(document.body).getPropertyValue(key);
  // }
  triggerElements.forEach((element, index) => {
    let theme = element.getAttribute('data-animate-to');
    console.log('Theme to animate to: ', theme);
    console.log('Current theme: ', currentTheme);

    if (theme === currentTheme) {
      // Find a different theme
      for (let potentialTheme in colorThemes) {
        if (potentialTheme !== currentTheme) {
          theme = potentialTheme;
          console.log('Switched to: ', theme);
          break;
        }
      }
    } else if (theme === 'current-theme') {
      theme = currentTheme;
      console.log('Switched to current theme: ', theme);
    }

    const isLastElement = index === triggerElements.length - 1;

    let colorScroll;

    if (colorScroll !== null && colorScroll !== undefined) {
      colorScroll.kill();
      colorScroll = null;
      ScrollTrigger.getById('scrollTrigger').kill();
    }

    colorScroll = gsap.timeline({ paused: true });

    colorScroll.to('body', { ...colorThemes[theme], duration: 0.3 });

    ScrollTrigger.create({
      id: 'scrollTrigger',
      trigger: element,
      start: `clamp(top 50%)`,
      end: 'bottom 50%',
      // markers: true,
      // toggleActions: `play complete none reverse`,
      onEnter: () => {
        // console.log('onEnter');
        colorScroll.play();
      },
      onEnterBack: () => {
        console.log('onEnterBack');
      },
      onLeave: () => {
        // console.log('onLeave');
        if (isLastElement) {
          gsap.set('body', {
            clearProps: 'all',
          });
        }
      },
      onLeaveBack: () => {
        console.log('onLeaveBack');
        colorScroll.reverse().then(() => {
          if (index === 0) {
            gsap.set('body', {
              clearProps: 'all',
            });
          }
        });
      },
    });
  });
}
