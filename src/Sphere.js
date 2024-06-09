import gsap from 'gsap';
import * as THREE from 'three';

// import noise from './shaders/Noise.glsl';
import fragmentShader from './shaders/sphereFragmentShader.glsl';
import vertexShader from './shaders/sphereVertexShader.glsl';

export default class Sphere extends THREE.Object3D {
  constructor(stage, options = {}) {
    super();
    this.stage = stage;
    this.options = options;
    this.options.strength = options.strength || 0.25;
    this.options.transparent = options.transparent ? 0.0 : 1.0;
    this.options.blendingMode = options.blendingMode || THREE.NormalBlending;
    this.options.color = options.color;
    this.initialScale = options.scale || 300;
    this.noiseSpeed = options.noiseSpeed || 0.5;
    this.rotationSpeed = options.rotationSpeed || 0.5;
    this.particleMin = options.particleMin || 6;
    this.particleMax = options.particleMax || 10;

    this.mouseMapped = new THREE.Vector2();
    this.mouseNormal = new THREE.Vector2();

    this.init();
  }

  async init() {
    await this.#createSphereMesh();
  }

  // Method to update the particle color
  updateParticleProperties(newColor, particleMin, particleMax) {
    const color = new THREE.Color(newColor);

    if (this.material.uniforms.color.value.getHex() !== color.getHex()) {
      gsap.to(this.material.uniforms.color.value, {
        r: color.r,
        g: color.g,
        b: color.b,
        duration: 1,
        ease: 'power4.out',
      });
    }

    if (this.material.uniforms.particleSizeMin.value !== particleMin) {
      gsap.to(this.material.uniforms.particleSizeMin, {
        value: particleMin,
        duration: 0.5,
      });
    }

    if (this.material.uniforms.particleSizeMax.value !== particleMax) {
      gsap.to(this.material.uniforms.particleSizeMax, {
        value: particleMax,
        duration: 0.5,
      });
    }
  }

  toggleBlendingMode() {
    const currentBlending = this.material.blending;
    const newBlending =
      currentBlending === THREE.AdditiveBlending ? THREE.NormalBlending : THREE.AdditiveBlending;

    if (currentBlending !== newBlending) {
      this.material.blending = newBlending;
      this.material.needsUpdate = true; // Ensure the change is reflected in rendering
    }
  }

  async #createSphereMesh() {
    this.geometry = new THREE.IcosahedronGeometry(1, 50);
    this.geometrySphere = new THREE.SphereGeometry(1, 100, 100);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        // color: { value: new THREE.Color(0x101a88) },
        color: { value: new THREE.Color(this.options.color) },
        time: { value: 0 },
        speed: { value: this.noiseSpeed },
        radius: { value: 1 },
        particleSizeMin: { value: this.particleMin },
        particleSizeMax: { value: this.particleMax },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthTest: true,
      depthWrite: false,
      blending: this.options.blendingMode,
      transparent: true,
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.scale.multiplyScalar(this.initialScale);

    // Set the initial position
    this.initialPositionY = window.scrollY - this.initialScale - window.innerHeight * 0.05;
    this.initialScroll = window.scrollY;

    this.mesh.position.y += this.initialPositionY;
    // this.mesh.position.z = -5000
    this.currentPosY = this.mesh.position.y;
    this.currentPosZ = this.mesh.position.z;

    this.stage.scene.add(this.mesh);

    // this.#animateSphereToPosition();

    // console.log(this.mesh.position.y);
  }

  animateSphere(time) {
    this.material.uniforms.time.value = time;
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
}
