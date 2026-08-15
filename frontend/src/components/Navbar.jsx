import { NavLink } from "react-router-dom";

function getLinkClassName({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-brand">
        <span className="brand-mark" aria-hidden="true">SP</span>
        <div>
          <span className="brand-name">Skill Path Navigator</span>
          <span className="brand-tagline">Learning intelligence</span>
        </div>
      </div>

      <ul className="navbar-links">
        <li>
          <NavLink className={getLinkClassName} to="/learners">
            <span className="nav-index" aria-hidden="true">01</span>
            <span>Learner Detail</span>
          </NavLink>
        </li>
        <li>
          <NavLink className={getLinkClassName} to="/path">
            <span className="nav-index" aria-hidden="true">02</span>
            <span>Path Finder</span>
          </NavLink>
        </li>
        <li>
          <NavLink className={getLinkClassName} to="/gaps">
            <span className="nav-index" aria-hidden="true">03</span>
            <span>Cohort Gaps</span>
          </NavLink>
        </li>
      </ul>

      <p className="navbar-footer">Curriculum workspace</p>
    </nav>
  );
}
