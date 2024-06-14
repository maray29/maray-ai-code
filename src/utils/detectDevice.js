export default function detectDevice() {
  const device = {
    isTouchDevice: false,
    isMobileDevice: false,
    userAgent: navigator.userAgent || navigator.vendor || window.opera,
  };

  // Detect touch device
  device.isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  // Detect mobile device using user agent string
  const mobileUserAgents = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Opera Mini/i,
    /IEMobile/i,
    /Mobile/i,
    /Kindle/i,
    /Silk/i,
    /BB10/i,
  ];

  for (let ua of mobileUserAgents) {
    if (ua.test(device.userAgent)) {
      device.isMobileDevice = true;
      break;
    }
  }

  // Additional heuristics for mobile detection
  if (!device.isMobileDevice) {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    device.isMobileDevice = screenWidth <= 768 || screenHeight <= 768;
  }

  return device;
}
