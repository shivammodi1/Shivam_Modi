import { Suspense, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { World } from "./World";
import { Player } from "./Player";
import { Viewmodel } from "./Gun";
import { Effects } from "./Effects";
import { Hud, PauseMenu } from "./Hud";
import { PanelOverlay } from "./Panels";
import { game, runtime } from "./store";
import { sound } from "./sound";
import { isTouchOnly } from "./device";
import { RemotePlayers } from "./Avatars";
import { connect, disconnect, getCallsign, updateProfile } from "./net";
import { getAgentTheme, themeVars, useAgentTheme } from "./theme";
import "./game.css";

const FONT_WAIT_MS = 2500;

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

export default function Lobby() {
  const [fontsReady, setFontsReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const theme = useAgentTheme();

  useEffect(() => {
    game.reset();
    document.title = "The Range · Shivam Modi";
    // Sign textures are drawn on a canvas, so the web fonts must be loaded first.
    const fallback = setTimeout(() => setFontsReady(true), FONT_WAIT_MS);
    Promise.all([document.fonts.load('64px "Bebas Neue"'), document.fonts.load("600 32px Rajdhani")])
      .catch(() => undefined)
      .finally(() => {
        clearTimeout(fallback);
        setFontsReady(true);
      });
    // Starts only if the menu already unlocked audio; otherwise "Click to play" starts it.
    sound.startAmbience("lobby");
    if (!isTouchOnly()) connect({ name: getCallsign(), color: getAgentTheme().accent });
    return () => {
      disconnect();
      clearTimeout(fallback);
      sound.stopAmbience();
      if (document.pointerLockElement) document.exitPointerLock();
      runtime.canvas = null;
    };
  }, []);

  // Other players see our avatar in the theme colour.
  useEffect(() => {
    updateProfile({ name: getCallsign(), color: theme.accent });
  }, [theme.accent]);

  if (isTouchOnly()) return <Navigate to="/browse/profile" replace />;

  return (
    <div className="vl-root vl-lobby" style={themeVars(theme)}>
      {fontsReady && (
        <Canvas
          camera={{ fov: 78, near: 0.05, far: 200 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            runtime.canvas = gl.domElement;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
        >
          <color attach="background" args={[theme.bg]} />
          <fog attach="fog" args={[theme.bg, 28, 70]} />
          <Suspense fallback={null}>
            {/* Remounting rebuilds the signs and lights in the new theme colours. */}
            <World key={theme.id} />
            <RemotePlayers />
            <Effects />
            <Player />
            <Viewmodel />
            <Ready onReady={() => setSceneReady(true)} />
          </Suspense>
        </Canvas>
      )}
      {sceneReady && (
        <>
          <Hud />
          <PauseMenu />
          <PanelOverlay />
        </>
      )}
      {!sceneReady && (
        <div className="vl-loading">
          <p className="vl-kicker">Loading map</p>
          <h1 className="vl-title">SM-HQ // The Range</h1>
          <div className="vl-loading__bar">
            <i />
          </div>
        </div>
      )}
    </div>
  );
}
