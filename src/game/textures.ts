import * as THREE from "three";

export const COLORS = {
  red: "#ff4655",
  navy: "#0f1923",
  ink: "#0b1118",
  bone: "#ece8e1",
  teal: "#3cf2c4",
  gold: "#f5c451",
};

interface LabelOpts {
  width?: number;
  height?: number;
  title: string;
  subtitle?: string;
  kicker?: string;
  accent?: string;
  background?: string;
  align?: "left" | "center";
}

/** Canvas-drawn sign texture. Uses the page's web fonts, so build it after document.fonts has loaded. */
export function labelTexture({
  width = 1024,
  height = 256,
  title,
  subtitle,
  kicker,
  accent = COLORS.red,
  background = "rgba(15,25,35,0.92)",
  align = "left",
}: LabelOpts) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const g = c.getContext("2d")!;

  g.fillStyle = background;
  g.fillRect(0, 0, width, height);

  // Angled accent block, the recurring Valorant UI motif.
  g.fillStyle = accent;
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(height * 0.12, 0);
  g.lineTo(height * 0.12, height);
  g.lineTo(0, height);
  g.fill();
  g.globalAlpha = 0.18;
  g.beginPath();
  g.moveTo(width * 0.78, 0);
  g.lineTo(width, 0);
  g.lineTo(width, height);
  g.lineTo(width * 0.7, height);
  g.fill();
  g.globalAlpha = 1;

  g.strokeStyle = "rgba(236,232,225,0.25)";
  g.lineWidth = 3;
  g.strokeRect(1.5, 1.5, width - 3, height - 3);

  const x = align === "center" ? width / 2 : height * 0.26;
  g.textAlign = align;
  g.textBaseline = "alphabetic";

  let y = height * 0.62;
  if (kicker) {
    g.fillStyle = accent;
    g.font = `600 ${Math.round(height * 0.13)}px Rajdhani, sans-serif`;
    g.fillText(kicker.toUpperCase().split("").join(String.fromCharCode(8202)), x, height * 0.27);
    y = height * 0.7;
  }

  g.fillStyle = COLORS.bone;
  g.font = `${Math.round(height * (subtitle ? 0.42 : 0.55))}px "Bebas Neue", Impact, sans-serif`;
  g.fillText(title.toUpperCase(), x, subtitle ? y - height * 0.05 : y + height * 0.06);

  if (subtitle) {
    g.fillStyle = "rgba(236,232,225,0.6)";
    g.font = `500 ${Math.round(height * 0.12)}px Rajdhani, sans-serif`;
    g.fillText(subtitle, x, height * 0.86);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function floorTexture() {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.fillStyle = "#1a242e";
  g.fillRect(0, 0, size, size);
  // Subtle concrete speckle.
  for (let i = 0; i < 2200; i++) {
    const v = 20 + Math.random() * 30;
    g.fillStyle = `rgba(${v},${v + 8},${v + 16},${Math.random() * 0.35})`;
    g.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }
  g.strokeStyle = "rgba(236,232,225,0.09)";
  g.lineWidth = 3;
  g.strokeRect(0, 0, size, size);
  g.strokeStyle = "rgba(236,232,225,0.04)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(size / 2, 0);
  g.lineTo(size / 2, size);
  g.moveTo(0, size / 2);
  g.lineTo(size, size / 2);
  g.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 10);
  tex.anisotropy = 8;
  return tex;
}

export function wallTexture() {
  const w = 512;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = "#c9c4bb";
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 1600; i++) {
    const v = 170 + Math.random() * 50;
    g.fillStyle = `rgba(${v},${v - 4},${v - 10},0.35)`;
    g.fillRect(Math.random() * w, Math.random() * h, 3, 3);
  }
  // Panel seams.
  g.strokeStyle = "rgba(60,60,60,0.35)";
  g.lineWidth = 4;
  g.strokeRect(0, 0, w, h);
  g.beginPath();
  g.moveTo(0, h * 0.62);
  g.lineTo(w, h * 0.62);
  g.stroke();
  // Lower band, darker like the range walls.
  g.fillStyle = "rgba(15,25,35,0.85)";
  g.fillRect(0, h * 0.62, w, h * 0.38);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

export function radialTexture(color: string) {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, color);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Wall screen with a heading and a row of big numbers. */
export function statBoardTexture({
  title,
  kicker,
  accent,
  stats,
  footer,
}: {
  title: string;
  kicker: string;
  accent: string;
  stats: { value: string; label: string }[];
  footer?: string;
}) {
  const width = 1280;
  const height = 560;
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const g = c.getContext("2d")!;
  g.fillStyle = "rgba(15,25,35,0.94)";
  g.fillRect(0, 0, width, height);
  g.fillStyle = accent;
  g.fillRect(0, 0, 18, height);
  g.globalAlpha = 0.12;
  g.beginPath();
  g.moveTo(width * 0.8, 0);
  g.lineTo(width, 0);
  g.lineTo(width, height);
  g.lineTo(width * 0.66, height);
  g.fill();
  g.globalAlpha = 1;
  g.strokeStyle = "rgba(236,232,225,0.25)";
  g.lineWidth = 3;
  g.strokeRect(1.5, 1.5, width - 3, height - 3);

  g.textBaseline = "alphabetic";
  g.textAlign = "left";
  g.fillStyle = accent;
  g.font = "700 34px Rajdhani, sans-serif";
  g.fillText(kicker.toUpperCase().split("").join(String.fromCharCode(8202)), 64, 82);
  g.fillStyle = COLORS.bone;
  g.font = '120px "Bebas Neue", Impact, sans-serif';
  g.fillText(title.toUpperCase(), 62, 196);

  const colW = (width - 128) / stats.length;
  stats.forEach((s, i) => {
    const x = 64 + i * colW;
    g.fillStyle = "rgba(236,232,225,0.12)";
    g.fillRect(x, 250, colW - 24, 4);
    g.fillStyle = COLORS.bone;
    g.font = '104px "Bebas Neue", Impact, sans-serif';
    g.fillText(s.value, x, 370);
    g.fillStyle = "rgba(236,232,225,0.6)";
    g.font = "700 28px Rajdhani, sans-serif";
    g.fillText(s.label.toUpperCase(), x, 414);
  });

  if (footer) {
    g.fillStyle = "rgba(236,232,225,0.55)";
    g.font = "600 30px Rajdhani, sans-serif";
    g.fillText(footer, 64, 500);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
