import '$utils/htmx-variable.js';

import gsap from 'gsap';
// import htmx from 'htmx.org';

let modalEventListenerAttached = false;
const { htmx } = window;

function init() {
  closeModal();
  addEventListeners();
}

function animateModal() {
  if (!modalEventListenerAttached) {
    const modal = htmx.find("[data-element='modal']");
    // console.log('htmx:load');
    if (modal) {
      gsap.killTweensOf(modal);
      // gsap.set(modal, { yPercent: 10 });
      gsap.to(modal, { opacity: 1, duration: 0.5, yPercent: 0 });
    }

    modalEventListenerAttached = true;
  }
}

function addEventListeners() {
  document.body.addEventListener('htmx:load', animateModal);
}

function removeEventListeners() {
  document.body.removeEventListener('htmx:load', animateModal);
}

function closeModalHandler() {
  const modal = htmx.find("[data-element='modal']");
  gsap.to(modal, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      htmx.remove(htmx.find("[data-element='modal']"));
      modalEventListenerAttached = false;
      removeEventListeners();
    },
  });
}

function closeModal() {
  const closeButton = document.querySelector("[data-element='close-button']");
  const modal = htmx.find("[data-element='modal']");
  const modalUnderlay = document.querySelector("[data-element='modal-underlay']");

  closeButton.addEventListener('click', closeModalHandler);

  modalUnderlay.addEventListener('click', (event) => {
    if (event.target === modalUnderlay) {
      gsap.to(modal, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          htmx.remove(htmx.find("[data-element='modal']"));
          modalEventListenerAttached = false;
          removeEventListeners();
        },
      });
    }
  });

  // Listen for keydown event on the whole document
  document.addEventListener('keydown', function (event) {
    // Check if the pressed key is 'Escape'
    if (event.key === 'Escape') {
      // Escape key was pressed
      gsap.to(modal, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          htmx.remove(htmx.find("[data-element='modal']"));
          modalEventListenerAttached = false;
          removeEventListeners();
        },
      });
    }
  });
}

window.Webflow ||= [];
window.Webflow.push(() => {
  init();
});
