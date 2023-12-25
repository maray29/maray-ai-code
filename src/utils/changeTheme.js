export default function changeTheme(button) {
  const currentTheme = localStorage.getItem('theme') || 'dark-mode';

  // Set initial theme
  document.body.setAttribute('data-theme', currentTheme);

  const currentPagePath = window.location.pathname;

  button.addEventListener('change', () => {
    let theme = document.body.getAttribute('data-theme');

    if (theme === 'light-mode') {
      theme = 'dark-mode';
      if (currentPagePath === '/portfolio') {
        if (this.stage) {
          this.stage.sphere.updateParticleProperties(0x2e2e2e, 4, 12);
          if (this.stage.effect1) this.stage.updateAberrationShader(0.35);
          this.stage.sphere.toggleBlendingMode();
        }
      }
    } else {
      theme = 'light-mode';
      if (currentPagePath === '/portfolio') {
        if (this.stage) {
          this.stage.sphere.updateParticleProperties(0xe6e6e6, 2, 6);
          if (this.stage.effect1) this.stage.updateAberrationShader(0.001);
          this.stage.sphere.toggleBlendingMode();
        }
      }
    }

    // Set new theme
    document.body.setAttribute('data-theme', theme);

    // Save theme choice
    localStorage.setItem('theme', theme);
  });
}
