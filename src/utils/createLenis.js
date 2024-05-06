import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function createLenis() {
  if (Webflow.env('editor') === undefined) {
    const lenis = new Lenis({
      lerp: 0.075,
      // easing: (t) => 1 - Math.pow(1 - t, 5),
      wheelMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }
}
