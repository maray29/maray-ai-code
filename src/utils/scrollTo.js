import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function createScrollTo() {
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
