import { Link } from "react-router-dom";
import { themeVars, useAgentTheme } from "./theme";
import "./game.css";

export default function NotFound() {
  const theme = useAgentTheme();
  return (
    <div className="vl-root vl-notfound" style={themeVars(theme)}>
      <div className="vl-menu__bg">
        <div className="vl-menu__grid" />
      </div>
      <div className="vl-notfound__card">
        <p className="vl-kicker">Error 404</p>
        <h1 className="vl-title vl-title--huge">Off the map</h1>
        <p className="vl-text">This location isn't on SM-HQ. Head back to the menu.</p>
        <div className="vl-actions">
          <Link className="vl-btn vl-btn--primary" to="/">
            Main menu
          </Link>
          <Link className="vl-btn" to="/browse/projects">
            Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
