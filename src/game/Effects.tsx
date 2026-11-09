import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { radialTexture } from "./textures";
import { runtime } from "./store";

const DECALS = 48;
const SPARKS = 12;
const TRACERS = 12;
const TRACER_LIFE = 0.07;
const SPARK_LIFE = 0.09;

export function Effects() {
  const decalTex = useMemo(() => radialTexture("rgba(10,10,10,0.95)"), []);
  const sparkTex = useMemo(() => radialTexture("rgba(255,170,70,0.9)"), []);
  const decals = useRef<THREE.Mesh[]>([]);
  const sparks = useRef<THREE.Mesh[]>([]);
  const tracers = useRef<THREE.Mesh[]>([]);
  const life = useRef({ decal: 0, spark: 0, tracer: 0, sparkAge: new Float32Array(SPARKS).fill(9), tracerAge: new Float32Array(TRACERS).fill(9) }).current;

  useEffect(() => {
    const tmp = new THREE.Vector3();
    runtime.spawnImpact = (point, normal) => {
      const d = decals.current[life.decal++ % DECALS];
      if (d) {
        d.position.copy(point).addScaledVector(normal, 0.01);
        d.lookAt(tmp.copy(d.position).add(normal));
        d.rotation.z = Math.random() * Math.PI;
        d.visible = true;
      }
      const i = life.spark++ % SPARKS;
      const s = sparks.current[i];
      if (s) {
        s.position.copy(point).addScaledVector(normal, 0.04);
        s.lookAt(tmp.copy(s.position).add(normal));
        s.visible = true;
        life.sparkAge[i] = 0;
      }
    };
    runtime.spawnTracer = (from, to) => {
      const i = life.tracer++ % TRACERS;
      const t = tracers.current[i];
      if (!t) return;
      const len = from.distanceTo(to);
      t.position.copy(from).lerp(to, 0.5);
      t.lookAt(to);
      t.scale.set(1, 1, len);
      t.visible = true;
      life.tracerAge[i] = 0;
    };
    return () => {
      runtime.spawnImpact = null;
      runtime.spawnTracer = null;
    };
  }, [life]);

  useFrame((_, dt) => {
    for (let i = 0; i < TRACERS; i++) {
      const t = tracers.current[i];
      if (!t || !t.visible) continue;
      life.tracerAge[i] += dt;
      const k = life.tracerAge[i] / TRACER_LIFE;
      if (k >= 1) t.visible = false;
      else (t.material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - k);
    }
    for (let i = 0; i < SPARKS; i++) {
      const s = sparks.current[i];
      if (!s || !s.visible) continue;
      life.sparkAge[i] += dt;
      const k = life.sparkAge[i] / SPARK_LIFE;
      if (k >= 1) s.visible = false;
      else s.scale.setScalar(0.25 + k * 0.35);
    }
  });

  return (
    <group>
      {Array.from({ length: DECALS }, (_, i) => (
        <mesh key={`d${i}`} ref={(m) => (decals.current[i] = m)} visible={false} raycast={() => null}>
          <planeGeometry args={[0.09, 0.09]} />
          <meshBasicMaterial map={decalTex} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-4} />
        </mesh>
      ))}
      {Array.from({ length: SPARKS }, (_, i) => (
        <mesh key={`s${i}`} ref={(m) => (sparks.current[i] = m)} visible={false} raycast={() => null}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={sparkTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
      {Array.from({ length: TRACERS }, (_, i) => (
        <mesh key={`t${i}`} ref={(m) => (tracers.current[i] = m)} visible={false} raycast={() => null}>
          <boxGeometry args={[0.012, 0.012, 1]} />
          <meshBasicMaterial color="#ffe3a8" transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
