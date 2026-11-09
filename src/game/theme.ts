import { useSyncExternalStore, type CSSProperties } from "react";

export interface AgentTheme {
  id: string;
  name: string;
  /** Main highlight: buttons, signs, light strips. */
  accent: string;
  accentDark: string;
  /** Secondary highlight: crosshair, prompts, kill feed. */
  alt: string;
  /** Text colour on top of an accent fill. */
  onAccent: string;
  bg: string;
  ink: string;
}

export const THEMES: AgentTheme[] = [
  { id: "vandal", name: "Vandal", accent: "#ff4655", accentDark: "#bd3944", alt: "#3cf2c4", onAccent: "#ece8e1", bg: "#0f1923", ink: "#0b1118" },
  { id: "jett", name: "Jett", accent: "#5ce1ff", accentDark: "#2a9fc4", alt: "#f5f0e6", onAccent: "#0b1118", bg: "#0d1822", ink: "#071017" },
  { id: "viper", name: "Viper", accent: "#3bff8a", accentDark: "#1fae5c", alt: "#d4ff3b", onAccent: "#0b1118", bg: "#0c1712", ink: "#07100b" },
  { id: "reyna", name: "Reyna", accent: "#c45cff", accentDark: "#8a2fc4", alt: "#ff5cb8", onAccent: "#ece8e1", bg: "#140f22", ink: "#0b0815" },
  { id: "phoenix", name: "Phoenix", accent: "#ff8a3d", accentDark: "#c45a1a", alt: "#ffd23f", onAccent: "#0b1118", bg: "#1a120d", ink: "#100b07" },
  { id: "sage", name: "Sage", accent: "#3cf2c4", accentDark: "#1fae8c", alt: "#a9f7ff", onAccent: "#0b1118", bg: "#0d1a1a", ink: "#071010" },
];

const STORAGE_KEY = "sm-agent-theme";
const listeners = new Set<() => void>();
let current = THEMES.find((t) => t.id === readStored()) ?? THEMES[0];

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getAgentTheme() {
  return current;
}

export function setAgentTheme(id: string) {
  const next = THEMES.find((t) => t.id === id);
  if (!next || next === current) return;
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage blocked: the theme lasts for this visit only.
  }
  listeners.forEach((l) => l());
}

export function useAgentTheme() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
  );
}

/** CSS custom properties consumed by game.css. */
export function themeVars(t: AgentTheme): CSSProperties {
  return {
    "--accent": t.accent,
    "--accent-dark": t.accentDark,
    "--alt": t.alt,
    "--on-accent": t.onAccent,
    "--navy": t.bg,
    "--ink": t.ink,
  } as CSSProperties;
}
