"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsapSetup";
import { KIND_COLOR } from "@/lib/content";

/**
 * Site-wide 3D background: a galaxy made of graphs. Node communities
 * (clusters tinted by the product's node-kind colors) float in a flattened
 * disc; edges wire satellites to their hub and hubs to nearby hubs — a
 * knowledge graph at cosmic scale. Nodes are soft round glows (custom GLSL)
 * with per-node twinkle and a cursor halo computed on the GPU. The camera
 * dives into the disc as you scroll (ScrollTrigger). Static geometry, one
 * draw call per layer, static under prefers-reduced-motion.
 */
const CLUSTERS = 18;
const SATS_MIN = 10;
const SATS_MAX = 22;
const DISC_RADIUS = 620;
const DUST = 900;
const ACCENT = new THREE.Color("#45d0b8");
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

/** Soft round dot texture for the ambient dust field. */
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

    // ---------- build the graph galaxy ----------
    const nodePos: number[] = [];
    const nodeCol: number[] = [];
    const nodeSize: number[] = [];
    const nodePhase: number[] = [];
    const edgePos: number[] = [];
    const edgeCol: number[] = [];
    const tmpC = new THREE.Color();

    const pushNode = (v: THREE.Vector3, c: THREE.Color, size: number) => {
      nodePos.push(v.x, v.y, v.z);
      nodeCol.push(c.r, c.g, c.b);
      nodeSize.push(size);
      nodePhase.push(Math.random());
    };
    const edgeList: { a: THREE.Vector3; b: THREE.Vector3; color: THREE.Color }[] = [];
    const pushEdge = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Color, dim: number) => {
      edgePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      edgeCol.push(c.r * dim, c.g * dim, c.b * dim, c.r * dim, c.g * dim, c.b * dim);
      edgeList.push({ a: a.clone(), b: b.clone(), color: c });
    };

    const hubs: { p: THREE.Vector3; color: THREE.Color }[] = [];
    for (let i = 0; i < CLUSTERS; i++) {
      // hubs on loose spiral rings around the center, flattened like a disc
      const a = (i / CLUSTERS) * Math.PI * 2 * 2.3 + Math.random() * 0.7;
      const r = 90 + (i / CLUSTERS) * DISC_RADIUS + (Math.random() - 0.5) * 90;
      const hub = new THREE.Vector3(
        Math.cos(a) * r,
        (Math.random() - 0.5) * 70,
        Math.sin(a) * r
      );
      const color = KIND_COLORS[i % KIND_COLORS.length];
      hubs.push({ p: hub, color });

      tmpC.copy(color).lerp(new THREE.Color("#ffffff"), 0.45);
      pushNode(hub, tmpC, 30 + Math.random() * 10);

      // satellites in a squashed ball around the hub
      const sats: THREE.Vector3[] = [];
      const nSats = SATS_MIN + Math.floor(Math.random() * (SATS_MAX - SATS_MIN + 1));
      for (let s = 0; s < nSats; s++) {
        const sat = new THREE.Vector3()
          .randomDirection()
          .multiply(new THREE.Vector3(1, 0.45, 1))
          .multiplyScalar(34 + Math.random() ** 1.5 * 78)
          .add(hub);
        sats.push(sat);
        tmpC.copy(color).multiplyScalar(0.55 + Math.random() * 0.45);
        pushNode(sat, tmpC, 9 + Math.random() * 10);
        if (Math.random() < 0.75) pushEdge(hub, sat, color, 0.7);
      }
      // a few peer links between satellites for real graph texture
      for (let s = 0; s < sats.length - 1; s += 3) {
        pushEdge(sats[s], sats[s + 1], color, 0.45);
      }
    }

    // inter-cluster backbone: each hub wires to its 2 nearest hubs, in accent
    for (let i = 0; i < hubs.length; i++) {
      const near = hubs
        .map((h, j) => ({ j, d: h.p.distanceTo(hubs[i].p) }))
        .filter((x) => x.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2);
      for (const n of near) {
        if (n.j > i) pushEdge(hubs[i].p, hubs[n.j].p, ACCENT, 0.55);
      }
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.Float32BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute("aColor", new THREE.Float32BufferAttribute(nodeCol, 3));
    nodeGeo.setAttribute("aSize", new THREE.Float32BufferAttribute(nodeSize, 1));
    nodeGeo.setAttribute("aPhase", new THREE.Float32BufferAttribute(nodePhase, 1));
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(1e5, 0, 1e5) },
    };
    const nodeMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePos, 3));
    edgeGeo.setAttribute("color", new THREE.Float32BufferAttribute(edgeCol, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // ---------- packets: glows transiting along the edges ----------
    const nPackets = edgeList.length;
    const pktPos = new Float32Array(nPackets * 3);
    const pktCol = new Float32Array(nPackets * 3);
    const pktSpeed = new Float32Array(nPackets);
    const pktPhase = new Float32Array(nPackets);
    for (let i = 0; i < nPackets; i++) {
      tmpC.copy(edgeList[i].color).lerp(new THREE.Color("#ffffff"), 0.35);
      tmpC.toArray(pktCol, i * 3);
      pktSpeed[i] = 0.06 + Math.random() * 0.12;
      pktPhase[i] = Math.random();
      edgeList[i].a.toArray(pktPos, i * 3);
    }
    const pktGeo = new THREE.BufferGeometry();
    pktGeo.setAttribute("position", new THREE.BufferAttribute(pktPos, 3).setUsage(THREE.DynamicDrawUsage));
    pktGeo.setAttribute("color", new THREE.BufferAttribute(pktCol, 3));
    const pktTex = dotTexture();
    const pktMat = new THREE.PointsMaterial({
      size: 7,
      map: pktTex,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
    });
    scene.add(new THREE.Points(pktGeo, pktMat));

    // ---------- ambient dust shell (round soft dots) ----------
    const dustPos = new Float32Array(DUST * 3);
    const dirV = new THREE.Vector3();
    for (let i = 0; i < DUST; i++) {
      dirV.randomDirection().multiplyScalar(900 + Math.random() * 1800);
      dirV.toArray(dustPos, i * 3);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustTex = dotTexture();
    scene.add(
      new THREE.Points(
        dustGeo,
        new THREE.PointsMaterial({
          size: 4.2,
          map: dustTex,
          color: 0xaec6d8,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.4,
          sizeAttenuation: true,
          depthWrite: false,
        })
      )
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    // camera flight: high above the disc -> gliding down between the clusters
    const camStart = { y: 300, z: 660 };
    const camEnd = { y: 60, z: 340 };
    const flight = { p: 0 };
    camera.position.set(0, camStart.y, camStart.z);
    camera.lookAt(0, 0, 0);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (reduced) renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    const disposeAll = () => {
      window.removeEventListener("resize", onResize);
      nodeGeo.dispose();
      nodeMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      pktGeo.dispose();
      pktMat.dispose();
      pktTex.dispose();
      dustGeo.dispose();
      dustTex.dispose();
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

      scene.rotation.y += 0.0005;
      flight.p += (scrollTarget - flight.p) * 0.045;
      const p = flight.p;
      camera.position.y = camStart.y + (camEnd.y - camStart.y) * p;
      camera.position.z = camStart.z + (camEnd.z - camStart.z) * p;
      camera.position.x += (mouse.x * 60 - camera.position.x) * 0.03;
      camera.lookAt(0, 0, 0);

      // edges breathe gently with the twinkle rhythm
      edgeMat.opacity = 0.42 + 0.1 * Math.sin(t * 0.9);

      // packets transit their edge, looping node -> node
      for (let i = 0; i < nPackets; i++) {
        const u = (t * pktSpeed[i] + pktPhase[i]) % 1;
        const e = edgeList[i];
        pktPos[i * 3] = e.a.x + (e.b.x - e.a.x) * u;
        pktPos[i * 3 + 1] = e.a.y + (e.b.y - e.a.y) * u;
        pktPos[i * 3 + 2] = e.a.z + (e.b.z - e.a.z) * u;
      }
      pktGeo.attributes.position.needsUpdate = true;

      // project the pointer onto the disc plane, into scene-local space
      ray.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
      const k = -camera.position.y / (ray.y || -1);
      if (k > 0) {
        const wx = camera.position.x + ray.x * k;
        const wz = camera.position.z + ray.z * k;
        const cos = Math.cos(-scene.rotation.y);
        const sin = Math.sin(-scene.rotation.y);
        uniforms.uMouse.value.set(wx * cos - wz * sin, 0, wx * sin + wz * cos);
      }

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
