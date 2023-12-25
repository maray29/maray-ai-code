import changeTheme from '$utils/changeTheme';
import createLenis from '$utils/createLenis';

function init() {
  const toggle = document.querySelector("[data-toggle='theme']");
  createLenis();
  changeTheme(toggle);
}

window.Webflow ||= [];
window.Webflow.push(() => {
  init();
});
