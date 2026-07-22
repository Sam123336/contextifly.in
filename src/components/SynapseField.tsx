"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsapSetup";
import { KIND_COLOR } from "@/lib/content";

/**
 * Site-wide 3D background: a round graph-planet system.
 * At the center a black-hole hub (the node with the most edges). Around it a
 * clearly spherical dot-globe (Fibonacci sphere) slowly spinning, then real
 * 3D planet spheres riding visible circular orbit rings, each wired back to
 * the hub. Sparse stars behind. Camera dives in as you scroll (ScrollTrigger).
 * Zero per-frame allocations, paused when hidden, static under reduced motion.
 */
const GLOBE_DOTS = 1500;
const GLOBE_R = 320;
const RING_COUNT = 6;
const PLANET_COUNT = 9;
const STARS = 1300;
const ACCENT = new THREE.Color("#45d0b8");
const KIND_COLORS = Object.values(KIND_COLOR).map((c) => new THREE.Color(c));
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** Photon-ring "black hole" sprite: dark core, bright teal ring, soft halo. */
function blackHoleTexture() {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0.0, "rgba(2,3,4,1)");
  g.addColorStop(0.3, "rgba(2,3,4,1)");
  g.addColorStop(0.36, "rgba(116,230,210,0.95)");
  g.addColorStop(0.42, "rgba(69,208,184,0.45)");
  g.addColorStop(0.6, "rgba(69,208,184,0.12)");
  g.addColorStop(1.0, "rgba(69,208,184,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
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

    // ---------- the black hole hub ----------
    const bh = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: blackHoleTexture(), transparent: true, depthWrite: false })
    );
    bh.scale.set(150, 150, 1);
    scene.add(bh);

    // it lights the planets
    scene.add(new THREE.AmbientLight(0x8899aa, 0.55));
    const glow = new THREE.PointLight(ACCENT, 3.2, 0, 0.6);
    scene.add(glow);

    // ---------- the dot globe: an unmistakably round sphere ----------
    const globe = new THREE.Group();
    const dotPos = new Float32Array(GLOBE_DOTS * 3);
    const dotCol = new Float32Array(GLOBE_DOTS * 3);
    const tmpC = new THREE.Color();
    for (let i = 0; i < GLOBE_DOTS; i++) {
      // Fibonacci sphere: even coverage, reads as a clean globe
      const y = 1 - (i / (GLOBE_DOTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = GOLDEN * i;
      dotPos[i * 3] = Math.cos(th) * r * GLOBE_R;
      dotPos[i * 3 + 1] = y * GLOBE_R;
      dotPos[i * 3 + 2] = Math.sin(th) * r * GLOBE_R;
      tmpC.copy(ACCENT).multiplyScalar(0.4 + Math.random() * 0.6);
      tmpC.toArray(dotCol, i * 3);
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
    dotGeo.setAttribute("color", new THREE.BufferAttribute(dotCol, 3));
    globe.add(
      new THREE.Points(
        dotGeo,
        new THREE.PointsMaterial({
          size: 2.6,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.75,
          sizeAttenuation: true,
          depthWrite: false,
        })
      )
    );
    globe.rotation.z = 0.18; // axial tilt, like a real planet
    scene.add(globe);

    // ---------- orbit rings + real planet spheres ----------
    const ringGroups: THREE.Group[] = [];
    const ringMats: THREE.LineBasicMaterial[] = [];
    const circle = (radius: number) => {
      const pts = new Float32Array(129 * 3);
      for (let s = 0; s <= 128; s++) {
        const a = (s / 128) * Math.PI * 2;
        pts[s * 3] = Math.cos(a) * radius;
        pts[s * 3 + 2] = Math.sin(a) * radius;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      return g;
    };
    for (let k = 0; k < RING_COUNT; k++) {
      const group = new THREE.Group();
      const radius = 430 + k * 62;
      const mat = new THREE.LineBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
      });
      group.add(new THREE.Line(circle(radius), mat));
      group.rotation.x = (Math.random() - 0.5) * 0.5;
      group.rotation.z = (Math.random() - 0.5) * 0.5;
      group.userData.radius = radius;
      scene.add(group);
      ringGroups.push(group);
      ringMats.push(mat);
    }

    const planets: {
      mesh: THREE.Mesh;
      group: THREE.Group;
      radius: number;
      phase: number;
      speed: number;
      size: number;
      mat: THREE.MeshStandardMaterial;
    }[] = [];
    for (let i = 0; i < PLANET_COUNT; i++) {
      const group = ringGroups[i % RING_COUNT];
      const radius = group.userData.radius as number;
      const size = 6 + Math.random() * 9;
      const color = KIND_COLORS[i % KIND_COLORS.length];
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.55,
        metalness: 0.15,
        emissive: color,
        emissiveIntensity: 0.12,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 24, 16), mat);
      group.add(mesh);
      planets.push({
        mesh,
        group,
        radius,
        phase: Math.random() * Math.PI * 2,
        speed: 0.22 / Math.sqrt(radius / 430),
        size,
        mat,
      });
    }

    // hub spokes: the black hole holds an edge to every planet
    const edgePos = new Float32Array(PLANET_COUNT * 6);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePos, 3).setUsage(THREE.DynamicDrawUsage));
    scene.add(
      new THREE.LineSegments(
        edgeGeo,
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.22, depthWrite: false })
      )
    );

    // ---------- sparse far stars ----------
    const starPos = new Float32Array(STARS * 3);
    const dir = new THREE.Vector3();
    for (let i = 0; i < STARS; i++) {
      dir.randomDirection().multiplyScalar(1100 + Math.random() * 1400);
      dir.toArray(starPos, i * 3);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          size: 1.7,
          color: 0x9fb8c9,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.55,
          sizeAttenuation: true,
          depthWrite: false,
        })
      )
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    // camera flight: high overview -> close pass over the globe
    const camStart = { y: 330, z: 860 };
    const camEnd = { y: 60, z: 470 };
    const flight = { p: 0 };
    camera.position.set(0, camStart.y, camStart.z);
    camera.lookAt(0, 0, 0);

    const scratch = new THREE.Vector3();
    const writePlanets = (t: number) => {
      for (let i = 0; i < PLANET_COUNT; i++) {
        const p = planets[i];
        const a = p.phase + t * p.speed;
        p.mesh.position.set(Math.cos(a) * p.radius, 0, Math.sin(a) * p.radius);
        // spoke endpoint in scene space (ring groups only rotate, origin shared)
        scratch.copy(p.mesh.position).applyMatrix4(p.group.matrix);
        edgePos[i * 6] = 0;
        edgePos[i * 6 + 1] = 0;
        edgePos[i * 6 + 2] = 0;
        edgePos[i * 6 + 3] = scratch.x;
        edgePos[i * 6 + 4] = scratch.y;
        edgePos[i * 6 + 5] = scratch.z;
      }
      edgeGeo.attributes.position.needsUpdate = true;
    };
    ringGroups.forEach((g) => g.updateMatrix());
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
      dotGeo.dispose();
      edgeGeo.dispose();
      starGeo.dispose();
      planets.forEach((p) => {
        p.mesh.geometry.dispose();
        p.mat.dispose();
      });
      ringGroups.forEach((g) => (g.children[0] as THREE.Line).geometry.dispose());
      ringMats.forEach((m) => m.dispose());
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
    const rel = new THREE.Vector3();
    const world = new THREE.Vector3();
    let raf = 0;
    let t = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      t += 0.016;

      scene.rotation.y += 0.00045;
      globe.rotation.y += 0.0016; // the planet spins on its axis

      flight.p += (scrollTarget - flight.p) * 0.045;
      const p = flight.p;
      camera.position.y = camStart.y + (camEnd.y - camStart.y) * p;
      camera.position.z = camStart.z + (camEnd.z - camStart.z) * p;
      camera.position.x += (mouse.x * 55 - camera.position.x) * 0.03;
      camera.lookAt(0, 0, 0);

      writePlanets(t);

      // planets near the pointer ray glow and swell
      ray.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
      for (const pl of planets) {
        pl.mesh.getWorldPosition(world);
        rel.copy(world).sub(camera.position);
        const along = rel.dot(ray);
        const d2 = rel.lengthSq() - along * along;
        const g = along > 0 ? Math.max(0, 1 - Math.sqrt(Math.max(d2, 0)) / 140) : 0;
        pl.mat.emissiveIntensity = 0.12 + g * 1.4;
        const s = 1 + g * 0.45;
        pl.mesh.scale.set(s, s, s);
      }

      // the black hole breathes
      const s = 150 + Math.sin(t * 0.8) * 7;
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
      style={{ opacity: 0.75 }}
    />
  );
}
