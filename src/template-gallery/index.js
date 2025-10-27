import { animateCursor, animateCursorElements, animateNavDropdown } from '$animations/animations';
import changeTheme from '$utils/changeTheme';
import createLenis from '$utils/createLenis';

function init() {
  createLenis();
  changeTheme("[data-element='theme-toggle']");
  animateCursor();
  animateCursorElements();
  animateNavDropdown();
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
