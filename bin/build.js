import * as esbuild from 'esbuild';
import { glsl } from 'esbuild-plugin-glsl';
import { readdirSync } from 'fs';
import { join, sep } from 'path';

// Config output
const BUILD_DIRECTORY = 'dist';
const PRODUCTION = process.env.NODE_ENV === 'production';

// Config entrypoint files
const ENTRY_POINTS = [
  'src/index.ts',
  'src/blog-os.ts',
  'src/blog-post/index.ts',
  'src/webflow/index.js',
  'src/portfolio/index.js',
  'src/home/index.js',
  'src/projects/index.js',
  'src/template-gallery/index.js',
  'src/css/*.css',
  'src/lawyers/index.js',
];

// Config dev serving
const LIVE_RELOAD = !PRODUCTION;
const SERVE_PORT = 3000;
const SERVE_ORIGIN = `http://localhost:${SERVE_PORT}`;

// Create context
const context = await esbuild.context({
  bundle: true,
  entryPoints: ENTRY_POINTS,
  outdir: BUILD_DIRECTORY,
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: PRODUCTION ? 'es2019' : 'esnext',
  inject: LIVE_RELOAD ? ['./bin/live-reload.js'] : undefined,
  define: {
    SERVE_ORIGIN: JSON.stringify(SERVE_ORIGIN),
  },
  plugins: [
    glsl({
      minify: true,
    }),
  ],
});

// Build files in prod
if (PRODUCTION) {
  await context.rebuild();
  context.dispose();
}

// Watch and serve files in dev
else {
  await context.watch();
  await context
    .serve({
      servedir: BUILD_DIRECTORY,
      port: SERVE_PORT,
    })
    .then(logServedFiles);
}

/**
 * Logs information about the files that are being served during local development.
 */
function logServedFiles() {
  /**
   * Recursively gets all files in a directory.
   * @param {string} dirPath
   * @returns {string[]} An array of file paths.
   */
  const getFiles = (dirPath) => {
    const files = readdirSync(dirPath, { withFileTypes: true }).map((dirent) => {
      const path = join(dirPath, dirent.name);
      return dirent.isDirectory() ? getFiles(path) : path;
    });

    return files.flat();
  };

  const files = getFiles(BUILD_DIRECTORY);

  const filesInfo = files
    .map((file) => {
      if (file.endsWith('.map')) return;

      // Normalize path and create file location
      const paths = file.split(sep);
      paths[0] = SERVE_ORIGIN;

      const location = paths.join('/');

      // Create import suggestion
      const tag = location.endsWith('.css')
        ? `<link href="${location}" rel="stylesheet" type="text/css"/>`
        : `<script defer src="${location}"></script>`;

      return {
        'File Location': location,
        'Import Suggestion': tag,
      };
    })
    .filter(Boolean);

  // eslint-disable-next-line no-console
  console.table(filesInfo);
}

// App class to structure and init the code
class App {
  // Curtains object
  curtains;
  // Smooth scroll Lenis object
  lenis;
  // WebGL planes
  planes = [];
  // Scroll value that we'll use to animate plane deformation
  scrollEffect = 0;

  // An object where we store all the DOM elements
  DOM = {
    h1: document.querySelector('h1'),
    planeElements: [...document.querySelectorAll('[data-animation="image"]')],
    heroImage: document.querySelector('.project_header_img'),
    heroWebGlPlane: null,
    paragraphs: [...document.querySelectorAll('[data-animation="paragraph"]')],
    wheel: document.querySelector('.wheel_icon'),
    wheelWrapper: document.querySelector('.wheel_wrapper'),
    pageWrap: document.querySelector('.page-wrapper'),
  };

  // An object where we store timelines and track animation state
  animationState = {};

  constructor() {
    this.init();
  }

  // Rest of the code
}

// window.addEventListener('load', () => {
//   const app = new App(); // eslint-disable-line
//   console.log('Loaded');
// });
