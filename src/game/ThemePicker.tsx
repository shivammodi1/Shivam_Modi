import { THEMES, setAgentTheme, useAgentTheme } from "./theme";
import { sound } from "./sound";

export function ThemePicker({ compact = false }: { compact?: boolean }) {
  const current = useAgentTheme();
  return (
    <div className={`vl-themes ${compact ? "vl-themes--compact" : ""}`} role="radiogroup" aria-label="Colour theme">
      {!compact && <span className="vl-themes__label">Theme · {current.name}</span>}
      <div className="vl-themes__row">
        {THEMES.map((t) => (
          <button
            key={t.id}
            role="radio"
            aria-checked={t.id === current.id}
            title={t.name}
            className={`vl-swatch ${t.id === current.id ? "is-active" : ""}`}
            style={{ background: `linear-gradient(135deg, ${t.accent} 50%, ${t.alt} 50%)` }}
            onMouseEnter={() => sound.uiHover()}
            onClick={() => {
              sound.uiClick();
              setAgentTheme(t.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
