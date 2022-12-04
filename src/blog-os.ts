import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  //Blog OS Landing page animation
  const blogosHeadingCard = document.querySelector('[am-element="blogos-card"]');
  const templateHeadingCard = document.querySelector('[am-element="template-card"]');

  const blogosScreenshots = document.querySelectorAll('[am-element="blogos-screenshot"]');
  const templateScreenshots = document.querySelectorAll('[am-element="template-screenshot"]');

  const templateFeatures = document.querySelector('[am-element="template-features"');
  let screenshotMoveSpeed = 100;

  // Section heading animation
  gsap.from(templateHeadingCard, {
    y: 500,
    // ease: 'none',
    stagger: 0.1,
    scrollTrigger: {
      trigger: templateHeadingCard,
      start: 'top bottom',
      end: 'bottom top',
      markers: true,
      scrub: 1,
    },
  });

  // Reset speed
  screenshotMoveSpeed = 100;

  // Section screenshots animation
  templateScreenshots.forEach((screenshot) => {
    screenshotMoveSpeed += 150;
    gsap.from(screenshot, {
      y: screenshotMoveSpeed,
      // ease: 'none',
      stagger: 0.1,
      scrollTrigger: {
        trigger: templateHeadingCard,
        start: 'top bottom',
        end: 'bottom top',
        // markers: true,
        scrub: 1,
      },
    });
  });
  gsap.from(templateFeatures, {
    y: 500,
    // ease: 'none',
    stagger: 0.1,
    scrollTrigger: {
      trigger: templateFeatures,
      start: 'top bottom',
      end: 'bottom top',
      // markers: true,
      scrub: 1,
    },
  });

  // Section heading animation
  gsap.from(blogosHeadingCard, {
    y: 500,
    // ease: 'none',
    stagger: 0.1,
    scrollTrigger: {
      trigger: blogosHeadingCard,
      start: 'top bottom',
      end: 'bottom top',
      markers: true,
      scrub: 1,
    },
  });

  // Section screenshots animation
  blogosScreenshots.forEach((screenshot) => {
    screenshotMoveSpeed += 150;
    gsap.from(screenshot, {
      y: screenshotMoveSpeed,
      // ease: 'none',
      stagger: 0.1,
      scrollTrigger: {
        trigger: blogosHeadingCard,
        start: 'top bottom',
        end: 'bottom top',
        markers: true,
        scrub: 1,
      },
      onComplete: () => {
        screenshotMoveSpeed = 100;
      },
    });
  });

  const paths = document.querySelectorAll('.feature-path');
  const featureItems = document.querySelectorAll('.template-features_item');

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i],
      length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  }

  let featureItem;

  for (let i = 0; i < featureItems.length; i++) {
    featureItem = featureItems[i];
    gsap.set(featureItem, { opacity: 0, y: 100 });
    gsap.to(featureItem, {
      scrollTrigger: {
        trigger: featureItem,
        start: '30% bottom',
        end: '50%',
        // scrub: 1,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      y: 0,
      stagger: 0.5,
      immediateRender: false,
    });

    gsap.to(paths[i], {
      strokeDashoffset: 0,
      stroke: '#9999B8',
      duration: 3,
      // stagger: 0.7,
      scrollTrigger: {
        trigger: featureItem,
        start: '30% bottom',
      },
    });
  }

  //Blog OS landing page h1 animation
  const blogosHeading = document.querySelector('[am-element="blog-os_heading"]');
  const text = new SplitType(blogosHeading, { types: 'words, lines' });
  let windowWidth = window.outerWidth;
  const blogosSubheading = document.querySelector('[am-element="blogos_subheading"');
  const featureList = document.querySelector('.v-list_row');
  const buttons = document.querySelector('.button-row2');

  // Split heading into lines.
  window.addEventListener('resize', () => {
    if (window.outerWidth !== windowWidth) {
      text.revert();
      location.reload();
    }
    windowWidth = window.outerWidth;
  });

  const blogosHeaderAnim = gsap.timeline();

  blogosHeaderAnim.from(text.words, {
    yPercent: 100,
    stagger: 0.1,
    duration: 0.6,
    opacity: 0,
    ease: 'power.out4',
    onComplete: function () {
      text.revert();
    },
  });
  blogosHeaderAnim.from(
    blogosSubheading,
    {
      yPercent: 100,
      opacity: 0,
      delay: 0.6,
    },
    '<'
  );
  blogosHeaderAnim.from(
    featureList,
    {
      yPercent: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
    },
    '<'
  );
  blogosHeaderAnim.from(
    buttons,
    {
      yPercent: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
    },
    '<'
  );

  /* Set Footer Copyright Year */
  function setCopyrightYear() {
    const copyRightYear = document.querySelector('[am-element="copyright-year"]');
    copyRightYear.textContent = new Date().getFullYear();
  }

  setCopyrightYear();
});
