import React from "react";
import ReactDOM from "react-dom";
import AppRoutes from "./AppRoutes.js";
import { Link, HashRouter } from "react-router-dom";

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <HashRouter>
          <nav className="navbar">
            <div className="navbar-title">Employee Management System</div>

            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Homerrrr
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/create" className="nav-link">
                  Create
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/upcomingRetirement" className="nav-link">
                  Retirement
                </Link>
              </li>
            </ul>
          </nav>
          <AppRoutes />
        </HashRouter>
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("root"));
