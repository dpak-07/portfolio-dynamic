"use client";

import { useEffect, useRef } from "react";
import { useLightweightMotion } from "@/hooks/useLightweightMotion";

export default function AdminBackground3D() {
  const canvasRef = useRef(null);
  const lightweightMotion = useLightweightMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || lightweightMotion) {
      return undefined;
    }

    let cancelled = false;
    let frameId = 0;
    let renderer = null;
    let scene = null;
    let camera = null;
    let group = null;
    let resizeHandler = null;
    let scrollHandler = null;
    let pointerHandler = null;
    let meshes = [];
    let targetScroll = 0;
    let targetPointer = { x: 0, y: 0 };
    let pointer = { x: 0, y: 0 };

    import("three").then((THREE) => {
      if (cancelled || !canvasRef.current) {
        return;
      }

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 80);
      camera.position.set(0, 0.4, 13);

      group = new THREE.Group();
      group.rotation.x = -0.18;
      scene.add(group);

      scene.add(new THREE.AmbientLight(0xcbd5e1, 1.8));
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
      keyLight.position.set(3, 4, 7);
      scene.add(keyLight);

      const grid = new THREE.GridHelper(24, 36, 0x38bdf8, 0x475569);
      grid.position.y = -4.8;
      grid.rotation.x = Math.PI * 0.06;
      grid.material.opacity = 0.16;
      grid.material.transparent = true;
      group.add(grid);
      meshes.push(grid);

      const ribbonColors = [0x22d3ee, 0xa78bfa, 0xf59e0b, 0x34d399];
      ribbonColors.forEach((color, index) => {
        const geometry = new THREE.TorusKnotGeometry(1.55 + index * 0.28, 0.012, 160, 8, 2 + (index % 2), 3);
        const material = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.2,
          wireframe: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((index - 1.5) * 2.3, -0.1 + index * 0.18, -index * 0.55);
        mesh.rotation.set(index * 0.7, index * 0.45, index * 0.2);
        group.add(mesh);
        meshes.push(mesh);
      });

      const boxGeometry = new THREE.BoxGeometry(0.055, 0.055, 0.055);
      const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        emissive: 0x0f172a,
        roughness: 0.45,
        metalness: 0.18,
      });
      const boxes = new THREE.InstancedMesh(boxGeometry, boxMaterial, 96);
      const dummy = new THREE.Object3D();

      for (let i = 0; i < 96; i += 1) {
        const lane = i % 12;
        const depth = Math.floor(i / 12);
        const x = (lane - 5.5) * 1.15 + Math.sin(depth) * 0.25;
        const y = Math.sin(i * 0.78) * 1.85;
        const z = -depth * 0.78 + Math.cos(i * 0.52) * 0.35;
        dummy.position.set(x, y, z);
        dummy.rotation.set(i * 0.13, i * 0.21, i * 0.08);
        const scale = 0.7 + (i % 5) * 0.18;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        boxes.setMatrixAt(i, dummy.matrix);
      }

      boxes.position.z = 1.2;
      boxes.instanceMatrix.needsUpdate = true;
      group.add(boxes);
      meshes.push(boxes);

      const updateScroll = () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        targetScroll = window.scrollY / maxScroll;
      };

      resizeHandler = () => {
        if (!renderer || !camera) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      };

      pointerHandler = (event) => {
        targetPointer = {
          x: (event.clientX / window.innerWidth - 0.5) * 2,
          y: (event.clientY / window.innerHeight - 0.5) * 2,
        };
      };

      scrollHandler = updateScroll;
      resizeHandler();
      updateScroll();
      window.addEventListener("resize", resizeHandler);
      window.addEventListener("scroll", scrollHandler, { passive: true });
      window.addEventListener("pointermove", pointerHandler, { passive: true });

      const clock = new THREE.Clock();
      const animate = () => {
        const elapsed = clock.getElapsedTime();
        pointer.x += (targetPointer.x - pointer.x) * 0.045;
        pointer.y += (targetPointer.y - pointer.y) * 0.045;

        if (group) {
          group.rotation.y = elapsed * 0.055 + targetScroll * 1.35 + pointer.x * 0.06;
          group.rotation.x = -0.18 + pointer.y * 0.04;
          group.position.y = -0.25 + Math.sin(elapsed * 0.38) * 0.14 - targetScroll * 0.5;
        }

        meshes.forEach((mesh, index) => {
          if (!mesh.rotation) return;
          mesh.rotation.z += 0.0008 + index * 0.00014;
          mesh.rotation.x += 0.0004;
        });

        camera.position.x += (pointer.x * 0.65 - camera.position.x) * 0.035;
        camera.position.y += (0.4 - pointer.y * 0.32 - camera.position.y) * 0.035;
        camera.lookAt(0, -0.1, -1.8);

        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(animate);
      };

      animate();
    });

    return () => {
      cancelled = true;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
      if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
      }
      if (pointerHandler) {
        window.removeEventListener("pointermove", pointerHandler);
      }
      meshes.forEach((mesh) => {
        mesh.geometry?.dispose?.();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose?.());
        } else {
          mesh.material?.dispose?.();
        }
      });
      renderer?.dispose?.();
    };
  }, [lightweightMotion]);

  return (
    <div className="admin-3d-background pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="admin-3d-fallback absolute inset-0" />
      <div className="admin-3d-grid absolute inset-0" />
    </div>
  );
}
