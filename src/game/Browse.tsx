import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { STATIONS, type StationId } from "./data";
import { SectionView } from "./Panels";
import { ThemePicker } from "./ThemePicker";
import { themeVars, useAgentTheme } from "./theme";
import "./game.css";

/** The portfolio without the 3D lobby: for phones, and for anyone who'd rather read than play. */
export default function Browse() {
  const { station: param } = useParams();
  const navigate = useNavigate();
  const theme = useAgentTheme();
  const station = (STATIONS.find((s) => s.id === param)?.id ?? "profile") as StationId;

  useEffect(() => {
    const label = STATIONS.find((s) => s.id === station)?.label;
    document.title = `${label} · Shivam Modi`;
  }, [station]);

  return (
    <div className="vl-root vl-browse" style={themeVars(theme)}>
      <div className="vl-menu__bg">
        <div className="vl-menu__grid" />
      </div>
      <div className="vl-browse__bar">
        <button className="vl-link" onClick={() => navigate("/")}>
          ← Main menu
        </button>
        <ThemePicker compact />
      </div>
      <div className="vl-browse__body">
        <SectionView
          station={station}
          onSwitch={(s) => navigate(`/browse/${s}`)}
          onClose={() => navigate("/")}
          closeLabel="Main menu"
        />
      </div>
    </div>
  );
}
