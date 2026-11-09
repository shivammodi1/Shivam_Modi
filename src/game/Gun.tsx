import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { COLORS, radialTexture } from "./textures";
import { runtime } from "./store";
import { useAgentTheme } from "./theme";

const metal = new THREE.MeshStandardMaterial({ color: "#232a32", metalness: 0.7, roughness: 0.38 });
const polymer = new THREE.MeshStandardMaterial({ color: "#3d444c", metalness: 0.25, roughness: 0.55 });
const dark = new THREE.MeshStandardMaterial({ color: "#11161c", metalness: 0.4, roughness: 0.55 });

/** Box-built rifle, pointing down -z. Used for the viewmodel and the arsenal racks. */
export function GunModel({ accent = COLORS.red, muzzleRef }: { accent?: string; muzzleRef?: React.Ref<THREE.Object3D> }) {
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 1.4 }), [accent]);
  return (
    <group>
      <mesh material={polymer} position={[0, 0, 0]}>
        <boxGeometry args={[0.07, 0.1, 0.42]} />
      </mesh>
      <mesh material={metal} position={[0, 0.058, -0.02]}>
        <boxGeometry args={[0.05, 0.02, 0.4]} />
      </mesh>
      <mesh material={dark} position={[0, -0.004, -0.29]}>
        <boxGeometry args={[0.062, 0.075, 0.2]} />
      </mesh>
      <mesh material={metal} position={[0, 0.012, -0.47]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.012, 0.012, 0.22, 10]} />
      </mesh>
      <mesh material={metal} position={[0, 0.012, -0.585]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.019, 0.016, 0.05, 8]} />
      </mesh>
      <mesh material={dark} position={[0, -0.13, -0.07]} rotation-x={0.22}>
        <boxGeometry args={[0.045, 0.18, 0.075]} />
      </mesh>
      <mesh material={dark} position={[0, -0.1, 0.11]} rotation-x={-0.35}>
        <boxGeometry args={[0.042, 0.12, 0.055]} />
      </mesh>
      <mesh material={polymer} position={[0, -0.015, 0.31]}>
        <boxGeometry args={[0.05, 0.095, 0.2]} />
      </mesh>
      <mesh material={dark} position={[0, -0.02, 0.415]}>
        <boxGeometry args={[0.055, 0.11, 0.02]} />
      </mesh>
      <mesh material={dark} position={[0, 0.088, -0.03]}>
        <boxGeometry args={[0.032, 0.04, 0.09]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0.02, -0.06]}>
        <boxGeometry args={[0.072, 0.012, 0.3]} />
      </mesh>
      <object3D ref={muzzleRef} position={[0, 0.012, -0.62]} />
    </group>
  );
}

const BASE = new THREE.Vector3(0.19, -0.18, -0.52);
const VIEWMODEL_SCALE = 0.5;

/**
 * First-person weapon. It lives in its own scene drawn after the world with the depth buffer cleared,
 * so it never sinks into walls. This also takes over R3F's render loop (priority 1).
 */
export function Viewmodel() {
  const gunScene = useMemo(() => new THREE.Scene(), []);
  const rig = useRef<THREE.Group>(null);
  const holder = useRef<THREE.Group>(null);
  const muzzle = useRef<THREE.Object3D>(null);
  const flash = useRef<THREE.Mesh>(null);
  const flashLight = useRef<THREE.PointLight>(null);
  const flashTex = useMemo(() => radialTexture("rgba(255,190,90,0.9)"), []);
  const { camera } = useThree();
  const theme = useAgentTheme();

  useEffect(() => {
    runtime.muzzle = muzzle.current;
    return () => {
      runtime.muzzle = null;
    };
  }, []);

  useFrame(({ gl, scene }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const g = runtime.gun;
    g.kick = Math.max(0, g.kick - dt * 11);
    g.flash = Math.max(0, g.flash - dt * 28);
    g.swayX *= Math.pow(0.0015, dt);
    g.swayY *= Math.pow(0.0015, dt);

    if (rig.current) {
      rig.current.position.copy(camera.position);
      rig.current.quaternion.copy(camera.quaternion);
    }
    if (holder.current) {
      const bobX = Math.sin(g.bob) * 0.014 * g.moving;
      const bobY = Math.abs(Math.cos(g.bob)) * 0.014 * g.moving;
      const dip = g.reload >= 0 ? Math.sin(g.reload * Math.PI) : 0;
      holder.current.position.set(BASE.x + bobX - g.swayX, BASE.y - bobY + g.swayY - dip * 0.13, BASE.z + g.kick * 0.055);
      holder.current.rotation.set(g.kick * 0.09 + dip * 0.55, -g.swayX * 0.6, dip * 0.4);
    }
    if (flash.current) {
      flash.current.visible = g.flash > 0.25;
      const s = 0.14 + Math.random() * 0.1;
      flash.current.scale.set(s, s, s);
      flash.current.rotation.z = Math.random() * Math.PI;
    }
    if (flashLight.current) flashLight.current.intensity = g.flash * 6;

    gl.autoClear = false;
    gl.clear();
    gl.render(scene, camera);
    gl.clearDepth();
    gl.render(gunScene, camera);
  }, 1);

  return createPortal(
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[1, 2, 1]} intensity={1.6} />
      <directionalLight position={[-2, 0.5, -1]} intensity={0.5} color="#9fb4ff" />
      <group ref={rig}>
        <group ref={holder} scale={VIEWMODEL_SCALE}>
          <GunModel accent={theme.accent} muzzleRef={muzzle} />
          <mesh ref={flash} position={[0, 0.012, -0.66]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={flashTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
          <pointLight ref={flashLight} position={[0, 0.03, -0.7]} color="#ffb35a" distance={2} intensity={0} />
        </group>
      </group>
    </>,
    gunScene,
  );
}
