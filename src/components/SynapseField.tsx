"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { KIND_COLOR } from "@/lib/content";

/**
 * Site-wide ambient 3D knowledge-graph field.
 * Concept from 21st.dev "SynapseBackground" (dhileepkumargm), rebuilt for
 * production: a few hundred nodes instead of 5000, nearest-neighbour edges
 * built once, zero per-frame allocations, scroll-driven camera depth, cursor
 * pulse in brand colors, paused when the tab is hidden, static under
 * prefers-reduced-motion.
 */
const COUNT = 320;
const SPREAD = 460;
const NEIGHBORS = 2;
const MAX_EDGE = 170;
const ACCENT = new THREE.Color("#45d0b8");
const KIND_COLORS = Object.values(KIND_COLOR).map((c) => new THREE.Color(c));

export default function SynapseField() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 420;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    // nodes
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const baseColors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2 * SPREAD * 1.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * SPREAD;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * SPREAD;
      const c = KIND_COLORS[(Math.random() * KIND_COLORS.length) | 0];
      c.toArray(colors, i * 3);
      c.toArray(baseColors, i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 3.4,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false,
      })
    );
    scene.add(points);

    // edges: nearest neighbours, built once
    const linePos: number[] = [];
    for (let i = 0; i < COUNT; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < COUNT; j++) {
        if (i === j) continue;
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        dists.push({ j, d: Math.hypot(dx, dy, dz) });
      }
      dists.sort((a, b) => a.d - b.d);
      for (let k = 0; k < NEIGHBORS; k++) {
        const { j, d } = dists[k];
        if (d > MAX_EDGE || j < i) continue; // dedupe: only add when j > i
        linePos.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        );
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePos), 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.11, depthWrite: false })
    );
    scene.add(lines);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (reduced) renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    if (reduced) {
      renderer.render(scene, camera);
      return () => {
        window.removeEventListener("resize", onResize);
        geo.dispose();
        lineGeo.dispose();
        renderer.dispose();
        host.removeChild(renderer.domElement);
      };
    }

    // pointer (normalized device coords)
    const mouse = new THREE.Vector2(-10, -10);
    const onPointer = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // scratch objects: zero allocations inside the frame loop
    const ray = new THREE.Vector3();
    const ptr = new THREE.Vector3();
    const tmp = new THREE.Color();
    const cur = new THREE.Color();
    let raf = 0;
    let scrollCur = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;

      scene.rotation.y += 0.00035;

      // scroll drives camera depth: the field slowly recedes as you read
      const target = window.scrollY * 0.06;
      scrollCur += (target - scrollCur) * 0.05;
      camera.position.y = -scrollCur * 0.6;
      scene.rotation.x = scrollCur * 0.0004;

      // gentle camera parallax toward the cursor
      camera.position.x += (mouse.x * 40 - camera.position.x) * 0.03;
      camera.lookAt(0, camera.position.y, 0);

      // cursor pulse: nodes near the pointer ray glow accent
      ray.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
      const dist = -camera.position.z / (ray.z || -1);
      ptr.copy(camera.position).addScaledVector(ray, dist);

      const colArr = geo.attributes.color.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const dx = positions[i * 3] - ptr.x;
        const dy = positions[i * 3 + 1] - ptr.y;
        const t = Math.max(0, 1 - Math.hypot(dx, dy) / 130);
        tmp.fromArray(baseColors, i * 3).lerp(ACCENT, t);
        cur.fromArray(colArr, i * 3).lerp(tmp, 0.12).toArray(colArr, i * 3);
      }
      geo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      geo.dispose();
      lineGeo.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mount}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ opacity: 0.7 }}
    />
  );
}
