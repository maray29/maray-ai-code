import changeTheme from '$utils/changeTheme';
import createLenis from '$utils/createLenis';

function init() {
  createLenis();
  changeTheme("[data-element='theme-toggle']");
  animateCursor('.cursor_inner', mouse, 0.2);
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
