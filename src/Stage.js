import gsap from 'gsap';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Sphere from './Sphere.js';
import { AberrationShader } from './shaders/AberrationShader.js';

// import postFXfragment from './shaders/postFXfragmentShader.glsl';
// import postFXvertex from './shaders/postFXvertexShader.glsl';

// define your constants here
const CAMERA_FOV = 30;
const NEAR = 0.1;
const FAR = 10000;

export default class Stage {
  #resizeCallback = () => this.#onResize();

  constructor(container, opts = { physics: false, debug: false }) {
    this.container = container;
    this.hasDebug = opts.debug;
    this.planes = [];
    this.#init();

    this.doc = this.document;
    this.sphereIntroOver = true;
    this.isIOS = this.isIOS();
  }

  async #init() {
    this.#setInitialParameters();
    this.#createScene();
    this.#createRenderer();
    this.#createCamera();

    // this.#setupPostFX();
    await this.#createSphere();
    // this.#createLogoSymbol()
    // this.#setupAnimationLoop()

    this.#createClock();
    this.#addEventListeners();
    this.#createControls();

    this.#initPostProcessing();

    // this.#createParticles()

    if (this.hasDebug) {
      const { Debug } = await import('./Debug.js');
      new Debug(this);

      const { default: Stats } = await import('stats.js');
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }

    this.renderer.setAnimationLoop(() => {
      this.timeSpeed = 2;
      this.time = 0;

      this.stats?.begin();

      this.#update();
      this.#render();

      this.stats?.end();
      // animation loop
      // this.renderer.setAnimationLoop(this.render.bind(this))
      // gsap.ticker.add(this.render.bind(this))
    });

    console.log(this);
  }

  #setInitialParameters() {
    this.renderParam = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.mouse = new THREE.Vector2();
    this.mouseTargetPos = new THREE.Vector2();
  }

  destroy() {
    this.renderer.dispose();
    this.#removeListeners();
  }

  #update() {
    const elapsed = this.clock.getElapsedTime();
    if (this.sphere) {
      this.sphere.animateSphere(elapsed, this.sphereIntroOver);
      // this.sphere2.animateSphere(elapsed)
    }
  }

  #initPostProcessing() {
    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight, 0.1, 0.1, 0.1)
    );
    this.effect1 = new ShaderPass(AberrationShader);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);

    // this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.effect1);
    // if (!this.isIOS) {
    // }
  }

  #render() {
    this.composer.render();
  }

  #createScene() {
    this.scene = new THREE.Scene();
  }

  #createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.container.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    this.renderer.setClearColor(0x000000);
    // this.renderer.setClearColor(0x9c3737)
  }

  #createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      this.renderParam.width / this.renderParam.height,
      NEAR,
      FAR
    );
    this.camera.fov = (2 * Math.atan(this.renderParam.height / 2 / 2000) * 180) / Math.PI;

    this.camera.position.z = 2000;

    this.camera.aspect = this.renderParam.width / this.renderParam.height;
    this.camera.updateProjectionMatrix();
  }

  #createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 15);
    this.initialControlPos = this.controls.target.clone();
    this.controls.update();
    this.controls.enabled = false;
  }

  #createClock() {
    this.clock = new THREE.Clock();
  }

  #addEventListeners() {
    // window.addEventListener('resize', this.#onResize.bind(this), false);
    window.addEventListener('resize', this.#resizeCallback, { passive: true });
  }

  #removeListeners() {
    window.removeEventListener('resize', this.#resizeCallback, {
      passive: true,
    });
  }

  #setupPostFX() {
    // Create a new framebuffer we will use to render to
    // the video card memory
    this.renderBufferA = new THREE.WebGLRenderTarget(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    );

    // Create a second framebuffer
    this.renderBufferB = new THREE.WebGLRenderTarget(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    );

    // Create a second scene that will hold our fullscreen plane
    this.postFXScene = new THREE.Scene();

    // Create a plane geometry that covers the entire screen
    this.postFXGeometry = new THREE.PlaneGeometry(innerWidth, innerHeight);

    // Create a plane material that expects a sampler texture input
    // We will pass our generated framebuffer texture to it
    this.postFXMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sampler: { value: null },
        time: { value: 0 },
        mousePos: { value: this.mouse },
      },
      // vertex shader will be in charge of positioning our plane correctly
      vertexShader: postFXvertex,
      fragmentShader: postFXfragment,
      transparent: true,
    });
    this.postFXMesh = new THREE.Mesh(this.postFXGeometry, this.postFXMaterial);
    this.postFXScene.add(this.postFXMesh);
  }

  #setupAnimationLoop() {
    // time
    this.timeSpeed = 2;
    this.time = 0;
    this.clock = new THREE.Clock();

    this.stats?.begin();

    this.#update();
    this.#render();

    this.stats?.end();

    gsap.ticker.add(this.render.bind(this));
  }

  #onResize() {
    this.doc = this.document;
    // this.#setLogoSymbolPosition(this.logoSymbol)

    const { width, height } = this.viewport;

    // this.screen.set(width, height);
    // Adjust renderer
    this.renderer.setSize(width, height);

    // Adjust camera
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.camera.fov = (2 * Math.atan(height / 2 / 2000) * 180) / Math.PI;

    // Adjust effect composer
    this.composer.setSize(width, height);

    // Resize the render targets for post processing
    if (this.bloomPass) {
      this.bloomPass.setSize(width, height);
    }
    this.effect1.setSize(width, height);

    // Call sphere's resize function if it exists
    if (this.sphere && typeof this.sphere.resize === 'function') {
      this.sphere.resize();
    }
  }

  updateMousePosition() {
    const interpolationFactor = 0.001;
    this.mouse.x += (this.mouseTargetPos.x - this.mouse.x) * interpolationFactor;
    this.mouse.y += (this.mouseTargetPos.y - this.mouse.y) * interpolationFactor;
  }

  get document() {
    let contentHeight = document.body.offsetHeight;
    let bodyHeight = document.body.scrollHeight;
    let windowHeight = window.innerHeight;
    let scrollableHeight = bodyHeight - windowHeight;

    return {
      contentHeight,
      bodyHeight,
      windowHeight,
      scrollableHeight,
    };
  }

  get viewport() {
    let width = this.container.clientWidth;
    let height = this.container.clientHeight;
    let aspectRatio = width / height;
    return {
      width,
      height,
      aspectRatio,
    };
  }

  get viewSize() {
    // fit plane to screen
    // https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f

    let distance = this.camera.position.z;
    let vFov = (this.camera.fov * Math.PI) / 180;
    // let height = 2 * Math.tan(vFov / 2) * distance
    const height = 2 * Math.tan(vFov / 2) * distance;
    let width = height * this.viewport.aspectRatio;
    return { width, height, vFov };
  }

  loadTexture(loader, url, index) {
    // https://threejs.org/docs/#api/en/loaders/TextureLoader

    return new Promise((resolve, reject) => {
      if (!url) {
        resolve({ texture: null, index });
        return;
      }
      // load a resource
      loader.load(
        // resource URL
        url,

        // onLoad callback
        (texture) => {
          resolve({ texture, index });
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        (error) => {
          // console.error("An error happened.", error);
          reject(error);
        }
      );
    });
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  isTouchDevice() {
    return (
      'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    );
  }

  isIOS() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return true;
    }

    return false;
  }

  animateOnScroll(x, scrollY) {
    this.moveSphereDownNewPosY =
      this.sphere.initialPositionY -
      (scrollY / this.doc.scrollableHeight) * (this.doc.bodyHeight - this.doc.windowHeight);

    // console.log('heellllllllllllooooooooooooo', this.moveSphereUpNewPosY);
    // console.log('heellllllllllllooooooooooooo', this.sphere.mesh.position.y);

    this.moveSphereUpNewPosY =
      this.sphere.currentPos +
      (scrollY / this.doc.scrollableHeight) * (this.doc.bodyHeight - this.doc.windowHeight);

    this.sphereNewPosZ = -scrollY * 0.5;
    this.newScale = this.sphere.initialScale * 0.2;

    gsap.to(this.sphere.mesh.position, {
      y: this.moveSphereUpNewPosY,
      z: this.sphereNewPosZ,
      duration: 0.2,
    });

    // if (!this.isMobileDevice() && !this.isTouchDevice()) {
    //   if (this.newScale > 600) {
    //     gsap.to(this.sphere.mesh.scale, {
    //       x: this.newScale,
    //       y: this.newScale,
    //       z: this.newScale,
    //     });
    //   }
    // }
  }

  async #createSphere() {
    this.sphere = await new Sphere(this, {
      scale: window.innerHeight * 1.2,
      noiseSpeed: 0.1,
      rotationSpeed: 0.1,
      particleMin: 4,
      particleMax: 12,
    });
    // this.animateOnScroll(0, window.scrollY);
    gsap.from(this.sphere.mesh.position, {
      y: this.moveSphereUpNewPosY - 100,
      duration: 1,
      // delay: 3,
    });
  }

  #createParticles() {
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 3000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
      positions[i * 3 + 2] = Math.random() * 3000;
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffeded,
      sizeAttenuation: true,
      size: 0.05,
    });

    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particles);
  }
}
