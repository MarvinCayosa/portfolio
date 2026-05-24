/**
 * CircularGallery — React Bits curved gallery (ogl). No vertex warp; auto-play + click.
 */

// Ported from React Bits; relaxed TS for ogl class fields.
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import type { OGLRenderingContext } from "ogl";
import { useEffect, useRef } from "react";
import "./CircularGallery.css";

type GL = OGLRenderingContext;

export interface CircularGalleryItem {
  image: string;
  text: string;
}

export interface GalleryCardLabel {
  key: number;
  index: number;
  x: number;
  y: number;
  opacity: number;
}

export interface CircularGalleryProps {
  items?: CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  onSelect?: (index: number) => void;
  /** Called whenever the centered card changes */
  onActiveChange?: (index: number) => void;
  font?: string;
  /** When true, project names render as HTML under each card (recommended) */
  htmlLabels?: boolean;
  className?: string;
}

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type GalleryLayout = {
  cardWidth: number;
  cardHeight: number;
  padding: number;
  bend: number;
};

/** Responsive card size, gap, and arc from container width. */
function getGalleryLayout(screenWidth: number, baseBend: number): GalleryLayout {
  if (screenWidth < 480) {
    return {
      cardWidth: 400,
      cardHeight: 520,
      padding: 3.4,
      bend: baseBend * 0.42,
    };
  }
  if (screenWidth < 768) {
    return {
      cardWidth: 500,
      cardHeight: 640,
      padding: 3.0,
      bend: baseBend * 0.58,
    };
  }
  if (screenWidth < 1024) {
    return {
      cardWidth: 620,
      cardHeight: 820,
      padding: 2.5,
      bend: baseBend * 0.78,
    };
  }
  return {
    cardWidth: 760,
    cardHeight: 1020,
    padding: 2.2,
    bend: baseBend,
  };
}

function autoBind(instance: object) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof (instance as Record<string, unknown>)[key] === "function") {
      (instance as Record<string, unknown>)[key] = (
        (instance as Record<string, unknown>)[key] as CallableFunction
      ).bind(instance);
    }
  });
}

function parseFontSizePx(font: string) {
  const match = font.match(/(\d+(?:\.\d+)?)\s*px/i);
  return match ? Number(match[1]) : 30;
}

function createTextTexture(
  gl: GL,
  text: string,
  font = "bold 30px monospace",
  color = "black",
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseFontSizePx(font) * 1.25);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  texture.needsUpdate = true;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor(opts: {
    gl: GL;
    plane: Mesh;
    renderer: Renderer;
    text: string;
    textColor?: string;
    font?: string;
  }) {
    autoBind(this);
    this.gl = opts.gl;
    this.plane = opts.plane;
    this.renderer = opts.renderer;
    this.text = opts.text;
    this.textColor = opts.textColor ?? "#545050";
    this.font = opts.font ?? "30px sans-serif";
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor,
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.08) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    this.mesh.setParent(this.plane);
    this.layout();
  }

  layout() {
    if (!this.mesh) return;
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor,
    );
    (this.mesh.program.uniforms.tMap as { value: Texture }).value = texture;
    const aspect = width / height;
    const textHeight = Math.max(this.plane.scale.y * 0.11, 0.08);
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.06;
  }
}

class Media {
  extra = 0;
  geometry!: Plane;
  gl!: GL;
  image!: string;
  index!: number;
  length!: number;
  renderer!: Renderer;
  scene!: Transform;
  screen!: { width: number; height: number };
  text!: string;
  viewport!: { width: number; height: number };
  bend!: number;
  textColor!: string;
  borderRadius!: number;
  font!: string;
  program!: Program;
  plane!: Mesh;
  title: Title | null = null;
  showWebGLTitle = true;
  speed = 0;
  isBefore = false;
  isAfter = false;
  scale = 1;
  padding = 2;
  width = 0;
  widthTotal = 0;
  x = 0;
  baseBend = 2.25;
  baseScaleX = 1;
  baseScaleY = 1;
  scaleMultiplier = 1;
  isHovered = false;
  isActive = false;

  constructor(opts: {
    geometry: Plane;
    gl: GL;
    image: string;
    index: number;
    length: number;
    renderer: Renderer;
    scene: Transform;
    screen: { width: number; height: number };
    text: string;
    viewport: { width: number; height: number };
    bend: number;
    textColor: string;
    borderRadius?: number;
    font?: string;
    showWebGLTitle?: boolean;
  }) {
    autoBind(this);
    Object.assign(this, opts);
    this.borderRadius = opts.borderRadius ?? 0;
    this.font = opts.font ?? "30px sans-serif";
    this.showWebGLTitle = opts.showWebGLTitle ?? true;
    this.createShader();
    this.createMesh();
    this.onResize();
    if (this.showWebGLTitle) this.createTitle();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec3 placeholder = vec3(0.14, 0.14, 0.15);
          vec4 color = texture2D(tMap, uv);
          float lum = max(max(color.r, color.g), color.b);
          vec3 rgb = mix(placeholder, color.rgb, clamp(lum * 1.2 + 0.25, 0.4, 1.0));
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(scroll: { current: number; last: number }, direction: string) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const absX = Math.abs(x);
      const effectiveX = Math.min(absX, H);
      let arc = R - Math.sqrt(R * R - effectiveX * effectiveX);

      // Extend arc smoothly past viewport edge so recycled cards don't snap upward.
      if (absX > H) {
        const edgeArc = R - Math.sqrt(R * R - H * H);
        const denom = Math.sqrt(Math.max(R * R - H * H, 0.0001));
        const slope = H / denom;
        arc = edgeArc + (absX - H) * slope * 0.85;
      }

      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(Math.min(effectiveX / R, 1));
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(Math.min(effectiveX / R, 1));
      }
    }

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }

    this.isActive = Math.abs(this.plane.position.x) < this.width * 0.35;
    const hoverScale = this.isHovered ? 1.08 : 1;
    const activeScale = this.isActive && !this.isHovered ? 1.04 : 1;
    const targetScale = hoverScale * activeScale;
    this.scaleMultiplier = lerp(this.scaleMultiplier, targetScale, 0.14);
    this.plane.scale.x = this.baseScaleX * this.scaleMultiplier;
    this.plane.scale.y = this.baseScaleY * this.scaleMultiplier;
  }

  onResize(opts: {
    screen?: { width: number; height: number };
    viewport?: { width: number; height: number };
    baseBend?: number;
  } = {}) {
    if (opts.screen) this.screen = opts.screen;
    if (opts.viewport) this.viewport = opts.viewport;
    if (opts.baseBend !== undefined) this.baseBend = opts.baseBend;

    const layout = getGalleryLayout(this.screen.width, this.baseBend);
    this.bend = layout.bend;
    this.scale = this.screen.height / 1500;
    this.baseScaleY =
      (this.viewport.height * (layout.cardHeight * this.scale)) / this.screen.height;
    this.baseScaleX =
      (this.viewport.width * (layout.cardWidth * this.scale)) / this.screen.width;
    this.plane.scale.y = this.baseScaleY * this.scaleMultiplier;
    this.plane.scale.x = this.baseScaleX * this.scaleMultiplier;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = layout.padding;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
    this.title?.layout();
  }
}

class GalleryApp {
  container: HTMLElement;
  scrollSpeed: number;
  scroll = { ease: 0.05, current: 0, target: 0, last: 0, position: 0 };
  onCheckDebounce: () => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  planeGeometry!: Plane;
  mediasImages: CircularGalleryItem[] = [];
  medias!: Media[];
  raf = 0;
  isDown = false;
  start = 0;
  isPaused = false;
  autoPlay: boolean;
  autoPlaySpeed: number;
  onSelect?: (index: number) => void;
  onActiveChange?: (index: number) => void;
  onLabelPositions?: (labels: GalleryCardLabel[]) => void;
  htmlLabels = false;
  uniqueCount = 0;
  dragDistance = 0;
  baseBend = 2.25;
  _lastEmittedActive = -1;
  mouseX = -1;
  mouseY = -1;

  boundOnResize!: () => void;
  boundOnMouseMove!: (e: MouseEvent) => void;
  boundOnWheel!: (e: WheelEvent) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: () => void;

  constructor(
    container: HTMLElement,
    opts: {
      items?: CircularGalleryItem[];
      bend?: number;
      textColor?: string;
      borderRadius?: number;
      font?: string;
      scrollSpeed?: number;
      scrollEase?: number;
      autoPlay?: boolean;
      autoPlaySpeed?: number;
      onSelect?: (index: number) => void;
      onActiveChange?: (index: number) => void;
      onLabelPositions?: (labels: GalleryCardLabel[]) => void;
      htmlLabels?: boolean;
    } = {},
  ) {
    autoBind(this);
    this.container = container;
    this.scrollSpeed = opts.scrollSpeed ?? 2;
    this.scroll.ease = opts.scrollEase ?? 0.05;
    this.autoPlay = opts.autoPlay ?? true;
    this.autoPlaySpeed = opts.autoPlaySpeed ?? 0.018;
    this.onSelect = opts.onSelect;
    this.onActiveChange = opts.onActiveChange;
    this.onLabelPositions = opts.onLabelPositions;
    this.htmlLabels = opts.htmlLabels ?? false;
    this.baseBend = opts.bend ?? 2.25;
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(
      opts.items,
      opts.bend ?? 3,
      opts.textColor ?? "#ffffff",
      opts.borderRadius ?? 0.05,
      opts.font ?? "bold 30px Figtree",
    );
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 10,
      widthSegments: 10,
    });
  }

  createMedias(
    items: CircularGalleryItem[] | undefined,
    bend: number,
    textColor: string,
    borderRadius: number,
    font: string,
  ) {
    const defaults: CircularGalleryItem[] = [
      { image: "https://picsum.photos/seed/p1/1200/800", text: "Project" },
    ];
    const galleryItems = items?.length ? items : defaults;
    this.uniqueCount = galleryItems.length;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        showWebGLTitle: !this.htmlLabels,
      });
    });
  }

  emitLabelPositions() {
    if (!this.onLabelPositions || !this.medias?.length) return;

    const vw = this.viewport.width;
    const vh = this.viewport.height;
    const w = this.screen.width;
    const h = this.screen.height;
    const labels: GalleryCardLabel[] = [];

    for (let i = 0; i < this.medias.length; i++) {
      const media = this.medias[i];
      const worldX = media.plane.position.x;
      if (Math.abs(worldX) > vw * 0.92) continue;

      const worldY = media.plane.position.y;
      const screenX = w / 2 + (worldX / (vw * 0.5)) * (w * 0.5);
      const screenY = h / 2 - (worldY / (vh * 0.5)) * (h * 0.5);
      const cardH = ((media.baseScaleY * media.scaleMultiplier) / vh) * h;
      const opacity = Math.max(0, 1 - Math.abs(worldX) / (vw * 0.62));

      labels.push({
        key: i,
        index: i % this.uniqueCount,
        x: screenX,
        y: screenY + cardH * 0.5 + 10,
        opacity,
      });
    }

    this.onLabelPositions(labels);
  }

  getActiveIndex() {
    if (!this.medias?.[0]) return 0;
    const width = this.medias[0].width;
    const raw = Math.round(Math.abs(this.scroll.current) / width);
    return raw % this.uniqueCount;
  }

  findHoveredMedia(clientX: number, clientY: number): Media | null {
    if (!this.medias?.length || clientX < 0) return null;

    const rect = this.container.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    const vw = this.viewport.width;
    const vh = this.viewport.height;

    let closest: Media | null = null;
    let closestDist = Infinity;

    for (const media of this.medias) {
      const worldX = media.plane.position.x;
      const worldY = media.plane.position.y;
      const screenX = rect.width / 2 + (worldX / (vw * 0.5)) * (rect.width * 0.5);
      const screenY = rect.height / 2 - (worldY / (vh * 0.5)) * (rect.height * 0.5);
      const cardW = (media.baseScaleX / vw) * rect.width;
      const cardH = (media.baseScaleY / vh) * rect.height;

      if (Math.abs(mx - screenX) < cardW * 0.52 && Math.abs(my - screenY) < cardH * 0.58) {
        const dist = Math.hypot(mx - screenX, my - screenY);
        if (dist < closestDist) {
          closestDist = dist;
          closest = media;
        }
      }
    }

    return closest;
  }

  emitSelect() {
    this.onSelect?.(this.getActiveIndex());
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
    this.dragDistance = 0;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    this.dragDistance = Math.max(this.dragDistance, Math.abs(this.start - x));
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    if (!this.isDown) return;
    const shouldSelect = this.dragDistance < 8;
    this.isDown = false;
    this.dragDistance = 0;
    this.onCheck();
    if (shouldSelect) this.emitSelect();
  }

  onWheel(e: WheelEvent) {
    const delta = e.deltaY;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias?.[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    this.medias?.forEach((media) =>
      media.onResize({
        screen: this.screen,
        viewport: this.viewport,
        baseBend: this.baseBend,
      }),
    );
  }

  update() {
    if (this.autoPlay && !this.isPaused && !this.isDown) {
      this.scroll.target -= this.autoPlaySpeed;
    }
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    const activeIndex = this.getActiveIndex();
    const hovered =
      !this.isDown && this.mouseX >= 0 ? this.findHoveredMedia(this.mouseX, this.mouseY) : null;

    this.medias?.forEach((media) => {
      media.isHovered = hovered === media;
      media.update(this.scroll, direction);
    });
    this.container.style.cursor = this.isDown
      ? "grabbing"
      : hovered
        ? "pointer"
        : "grab";
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.emitLabelPositions();
    this.scroll.last = this.scroll.current;

    // Emit active index change whenever the centered card changes
    const newActive = activeIndex;
    if (newActive !== this._lastEmittedActive) {
      this._lastEmittedActive = newActive;
      this.onActiveChange?.(newActive);
    }

    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    window.addEventListener("resize", this.boundOnResize);
    this.container.addEventListener("wheel", this.boundOnWheel, { passive: true });
    this.container.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    this.container.addEventListener("touchstart", this.boundOnTouchDown, { passive: true });
    this.container.addEventListener("touchmove", this.boundOnTouchMove, { passive: true });
    this.container.addEventListener("touchend", this.onTouchUp);
    this.boundOnMouseMove = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };
    this.container.addEventListener("mousemove", this.boundOnMouseMove);
    this.container.addEventListener("mouseenter", (e: MouseEvent) => {
      this.isPaused = true;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    this.container.addEventListener("mouseleave", () => {
      this.isPaused = false;
      this.mouseX = -1;
      this.mouseY = -1;
    });
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    this.container.removeEventListener("wheel", this.boundOnWheel);
    this.container.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    this.container.removeEventListener("touchstart", this.boundOnTouchDown);
    this.container.removeEventListener("touchmove", this.boundOnTouchMove);
    this.container.removeEventListener("touchend", this.onTouchUp);
    this.container.removeEventListener("mousemove", this.boundOnMouseMove);
    if (this.renderer?.gl?.canvas?.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export function CircularGallery({
  items,
  bend = 3,
  textColor = "#f2f0eb",
  borderRadius = 0.05,
  scrollSpeed = 2,
  scrollEase = 0.02,
  autoPlay = true,
  autoPlaySpeed = 0.018,
  onSelect,
  onActiveChange,
  font = '600 22px "Playfair Display", Georgia, serif',
  htmlLabels = true,
  className = "",
}: CircularGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const labelPoolRef = useRef<HTMLDivElement[]>([]);
  const itemsRef = useRef(items);

  itemsRef.current = items;

  useEffect(() => {
    const el = containerRef.current;
    const labelsRoot = labelsRef.current;
    if (!el) return;

    const syncLabels = (labels: GalleryCardLabel[]) => {
      if (!labelsRoot) return;
      const galleryItems = itemsRef.current ?? [];
      const pool = labelPoolRef.current;

      while (pool.length < labels.length) {
        const node = document.createElement("div");
        node.className = "gallery-card-label";
        labelsRoot.appendChild(node);
        pool.push(node);
      }
      while (pool.length > labels.length) {
        pool.pop()?.remove();
      }

      labels.forEach((label, i) => {
        const node = pool[i];
        if (!node) return;
        const title = galleryItems[label.index]?.text ?? "";
        node.textContent = title;
        node.style.left = `${label.x}px`;
        node.style.top = `${label.y}px`;
        node.style.opacity = String(label.opacity);
        node.style.visibility = label.opacity < 0.08 ? "hidden" : "visible";
      });
    };

    const app = new GalleryApp(el, {
      items,
      bend,
      textColor,
      borderRadius,
      scrollSpeed,
      scrollEase,
      autoPlay,
      autoPlaySpeed,
      onSelect,
      onActiveChange,
      font,
      htmlLabels,
      onLabelPositions: htmlLabels ? syncLabels : undefined,
    });
    return () => {
      app.destroy();
      labelPoolRef.current.forEach((node) => node.remove());
      labelPoolRef.current = [];
    };
  }, [items, bend, textColor, borderRadius, scrollSpeed, scrollEase, autoPlay, autoPlaySpeed, onSelect, onActiveChange, font, htmlLabels]);

  return (
    <div ref={rootRef} className={`circular-gallery-root relative h-full w-full ${className}`}>
      <div
        ref={containerRef}
        className="circular-gallery h-full w-full"
        role="region"
        aria-label="Project gallery"
      />
      {htmlLabels && (
        <div ref={labelsRef} className="gallery-card-labels pointer-events-none absolute inset-0 overflow-visible" />
      )}
    </div>
  );
}
