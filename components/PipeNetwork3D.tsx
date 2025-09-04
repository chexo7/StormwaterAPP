import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PipeNetwork3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const dataStr = localStorage.getItem('pipe-network-data');
    const allPoints: THREE.Vector3[] = [];
    const meshes: THREE.Object3D[] = [];
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        const cb = data.cbLayer?.features || [];
        const pipes = data.pipesLayer?.features || [];
        const sphereGeom = new THREE.SphereGeometry(0.5, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        cb.forEach((f: any) => {
          if (f.geometry?.type === 'Point') {
            const [x, y] = f.geometry.coordinates;
            const z = Number(f.properties?.['Inv Out [ft]']) || 0;
            const v = new THREE.Vector3(x, y, z);
            allPoints.push(v);
            const m = new THREE.Mesh(sphereGeom, sphereMat);
            m.position.copy(v);
            meshes.push(m);
          }
        });
        const lineMat = new THREE.LineBasicMaterial({ color: 0x00aaff });
        pipes.forEach((f: any) => {
          if (f.geometry?.type === 'LineString') {
            const coords = f.geometry.coordinates as number[][];
            const zStart = Number(f.properties?.['Elevation Invert In [ft]']) || 0;
            const zEnd = Number(f.properties?.['Elevation Invert Out [ft]']) || 0;
            const pts = coords.map((c, i) => {
              const t = coords.length > 1 ? i / (coords.length - 1) : 0;
              const z = zStart + (zEnd - zStart) * t;
              const v = new THREE.Vector3(c[0], c[1], z);
              allPoints.push(v);
              return v;
            });
            const geom = new THREE.BufferGeometry().setFromPoints(pts);
            const line = new THREE.Line(geom, lineMat);
            meshes.push(line);
          }
        });
      } catch (err) {
        // ignore parse errors
      }
    }

    const box = new THREE.Box3().setFromPoints(allPoints);
    const center = box.getCenter(new THREE.Vector3());
    meshes.forEach(obj => {
      if (obj instanceof THREE.Line) {
        const pos = (obj.geometry as THREE.BufferGeometry).getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i < pos.count; i++) {
          pos.setX(i, pos.getX(i) - center.x);
          pos.setY(i, pos.getY(i) - center.y);
          pos.setZ(i, pos.getZ(i) - center.z);
        }
        pos.needsUpdate = true;
      } else {
        obj.position.sub(center);
      }
      scene.add(obj);
    });

    const size = box.getSize(new THREE.Vector3()).length();
    camera.position.set(0, 0, size * 1.5 || 50);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default PipeNetwork3D;
