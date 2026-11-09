import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainMenu from "./game/MainMenu";
import Browse from "./game/Browse";
import NotFound from "./game/NotFound";

// three.js is large; only players who press Play download it.
const Lobby = lazy(() => import("./game/Lobby"));

// Paths from the previous site, so links already shared keep working.
const LEGACY_REDIRECTS: Record<string, string> = {
  "/home": "/",
  "/about": "/browse/profile",
  "/projects": "/browse/projects",
  "/skills": "/browse/arsenal",
  "/certifications": "/browse/trophies",
  "/contact": "/browse/comms",
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route
        path="/play"
        element={
          <Suspense fallback={<div style={{ position: "fixed", inset: 0, background: "#0b1118" }} />}>
            <Lobby />
          </Suspense>
        }
      />
      <Route path="/browse/:station?" element={<Browse />} />
      {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
