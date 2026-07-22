"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsapSetup";
import { KIND_COLOR } from "@/lib/content";

/**
 * Site-wide 3D background: a shader-rendered spiral galaxy with a black-hole
 * hub. Every star is a soft round glow (custom GLSL, not the default square
 * GL points), with per-star twinkle and a cursor halo computed on the GPU.
 * Small planet spheres orbit the core, wired to the hub. The camera dives
 * into the galaxy as you scroll (ScrollTrigger). One draw call per layer,
 * zero per-frame JS particle loops, static under prefers-reduced-motion.
 */
const STARS = 16000;
const FAR_STARS = 1800;
const RADIUS = 780;
const BRANCHES = 3;
const SPIN = 2.6;
const PLANETS = 5;
const ACCENT = new THREE.Color("#45d0b8");
const CORE = new THREE.Color("#b8fff2");
const MID = new THREE.Color("#4fd0e8");
const OUTER = new THREE.Color("#8b7ff0");
const KIND_COLORS = Object.values(KIND_COLOR).map((c) => new THREE.Color(c));

const VERT = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform vec3 uMouse;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.72 + 0.28 * sin(uTime * 1.6 + aPhase * 6.2831);
    float d = distance(position.xz, uMouse.xz);
    float halo = 1.0 + 2.4 * smoothstep(170.0, 0.0, d);
    vColor = aColor * tw * halo;
    gl_PointSize = aSize * (0.9 + 0.35 * halo) * (460.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.04, d);
    gl_FragColor = vec4(vColor * a, a);
  }
`;

/** Photon-ring "black hole" sprite: dark core, bright teal ring, soft halo. */
function blackHoleTexture() {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0.0, "rgba(2,3,4,1)");
  g.addColorStop(0.28, "rgba(2,3,4,1)");
  g.addColorStop(0.34, "rgba(184,255,242,0.95)");
  g.addColorStop(0.4, "rgba(69,208,184,0.5)");
  g.addColorStop(0.58, "rgba(69,208,184,0.13)");
  g.addColorStop(1.0, "rgba(69,208,184,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/** Soft round dot texture for the far starfield. */
function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export default function SynapseField() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 1, 6000);

    // ---------- the spiral galaxy (custom shader, soft round stars) ----------
    const pos = new Float32Array(STARS * 3);
    const col = new Float32Array(STARS * 3);
    const sizes = new Float32Array(STARS);
    const phases = new Float32Array(STARS);
    const tmpC = new THREE.Color();
    for (let i = 0; i < STARS; i++) {
      const r = Math.random() ** 1.7 * RADIUS + 26;
      const branch = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const angle = branch + (r / RADIUS) * SPIN;
      const rnd = (p: number) => (Math.random() ** p) * (Math.random() < 0.5 ? 1 : -1);
      const spread = 0.38 * r;
      const x = Math.cos(angle) * r + rnd(3) * spread;
      const z = Math.sin(angle) * r + rnd(3) * spread;
      const y = rnd(3) * spread * 0.32;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      const t = Math.min(1, r / RADIUS);
      if (t < 0.5) tmpC.copy(CORE).lerp(MID, t * 2);
      else tmpC.copy(MID).lerp(OUTER, (t - 0.5) * 2);
      tmpC.multiplyScalar(0.55 + Math.random() * 0.45);
      tmpC.toArray(col, i * 3);
      sizes[i] = Math.random() < 0.03 ? 15 + Math.random() * 10 : 4 + Math.random() * 7;
      phases[i] = Math.random();
    }
    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    galaxyGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    galaxyGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    galaxyGeo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(1e5, 0, 1e5) },
    };
    const galaxyMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(galaxyGeo, galaxyMat));

    // ---------- black hole hub + light ----------
    const bh = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: blackHoleTexture(), transparent: true, depthWrite: false })
    );
    bh.scale.set(130, 130, 1);
    scene.add(bh);
    scene.add(new THREE.AmbientLight(0x8899aa, 0.5));
    scene.add(new THREE.PointLight(ACCENT, 3.0, 0, 0.6));

    // ---------- small planets orbiting the hub, wired to it ----------
    const planets: { mesh: THREE.Mesh; r: number; ph: number; sp: number; mat: THREE.MeshStandardMaterial }[] = [];
    for (let i = 0; i < PLANETS; i++) {
      const color = KIND_COLORS[i % KIND_COLORS.length];
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        metalness: 0.15,
        emissive: color,
        emissiveIntensity: 0.25,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(5 + Math.random() * 6, 24, 16), mat);
      scene.add(mesh);
      planets.push({ mesh, r: 130 + i * 52, ph: Math.random() * Math.PI * 2, sp: 0.3 / Math.sqrt(1 + i * 0.4), mat });
    }
    const edgePos = new Float32Array(PLANETS * 6);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePos, 3).setUsage(THREE.DynamicDrawUsage));
    scene.add(
      new THREE.LineSegments(
        edgeGeo,
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.28, depthWrite: false })
      )
    );

    // ---------- far star shell (round soft dots) ----------
    const farPos = new Float32Array(FAR_STARS * 3);
    const dirV = new THREE.Vector3();
    for (let i = 0; i < FAR_STARS; i++) {
      dirV.randomDirection().multiplyScalar(1300 + Math.random() * 1500);
      dirV.toArray(farPos, i * 3);
    }
    const farGeo = new THREE.BufferGeometry();
    farGeo.setAttribute("position", new THREE.BufferAttribute(farPos, 3));
    const farTex = dotTexture();
    scene.add(
      new THREE.Points(
        farGeo,
        new THREE.PointsMaterial({
          size: 4.2,
          map: farTex,
          color: 0xaec6d8,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.5,
          sizeAttenuation: true,
          depthWrite: false,
        })
      )
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    // camera flight: high above the disk -> gliding down into the arms
    const camStart = { y: 340, z: 820 };
    const camEnd = { y: 80, z: 430 };
    const flight = { p: 0 };
    camera.position.set(0, camStart.y, camStart.z);
    camera.lookAt(0, 0, 0);

    const writePlanets = (t: number) => {
      for (let i = 0; i < PLANETS; i++) {
        const p = planets[i];
        const a = p.ph + t * p.sp;
        p.mesh.position.set(Math.cos(a) * p.r, Math.sin(a * 0.7) * 14, Math.sin(a) * p.r);
        edgePos[i * 6] = 0;
        edgePos[i * 6 + 1] = 0;
        edgePos[i * 6 + 2] = 0;
        edgePos[i * 6 + 3] = p.mesh.position.x;
        edgePos[i * 6 + 4] = p.mesh.position.y;
        edgePos[i * 6 + 5] = p.mesh.position.z;
      }
      edgeGeo.attributes.position.needsUpdate = true;
    };
    writePlanets(0);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (reduced) renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    const disposeAll = () => {
      window.removeEventListener("resize", onResize);
      galaxyGeo.dispose();
      galaxyMat.dispose();
      edgeGeo.dispose();
      farGeo.dispose();
      farTex.dispose();
      planets.forEach((p) => {
        p.mesh.geometry.dispose();
        p.mat.dispose();
      });
      bh.material.map?.dispose();
      bh.material.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };

    if (reduced) {
      renderer.render(scene, camera);
      return disposeAll;
    }

    // scroll progress via ScrollTrigger (gsap-skills canonical pattern)
    let scrollTarget = 0;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollTarget = self.progress;
      },
    });

    const mouse = new THREE.Vector2(-10, -10);
    const onPointer = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // scratch objects: zero allocations in the frame loop
    const ray = new THREE.Vector3();
    let raf = 0;
    let t = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      t += 0.016;
      uniforms.uTime.value = t;

      scene.rotation.y += 0.0006;
      flight.p += (scrollTarget - flight.p) * 0.045;
      const p = flight.p;
      camera.position.y = camStart.y + (camEnd.y - camStart.y) * p;
      camera.position.z = camStart.z + (camEnd.z - camStart.z) * p;
      camera.position.x += (mouse.x * 60 - camera.position.x) * 0.03;
      camera.lookAt(0, 0, 0);

      writePlanets(t);

      // project the pointer onto the galaxy plane, into galaxy-local space
      ray.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
      const k = -camera.position.y / (ray.y || -1);
      if (k > 0) {
        const wx = camera.position.x + ray.x * k;
        const wz = camera.position.z + ray.z * k;
        const cos = Math.cos(-scene.rotation.y);
        const sin = Math.sin(-scene.rotation.y);
        uniforms.uMouse.value.set(wx * cos - wz * sin, 0, wx * sin + wz * cos);
      }

      // the black hole breathes
      const s = 130 + Math.sin(t * 0.8) * 6;
      bh.scale.set(s, s, 1);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
      window.removeEventListener("pointermove", onPointer);
      disposeAll();
    };
  }, []);

  return (
    <div
      ref={mount}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ opacity: 0.8 }}
    />
  );
}
