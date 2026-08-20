import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Switcher from "./Switcher.tsx";

const NavbarAdmin = () => {
  const { t } = useTranslation();

  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkStyles = ({ isActive }: { isActive: boolean }) => ({
    backgroundColor: isActive ? "#000" : "",
    color: isActive ? "#fff" : "",
  });

  return (
    <>
      <div className="top large">
        <div
          className={`bar ${scrolled ? "card animate-top white" : ""}`}
          id="myNavbar"
        >
          <a
            className="bar-item button hide-medium hide-large right"
            href="#"
            onClick={() => setShowMenu(!showMenu)}
          >
            <i className="fa fa-bars"></i>
          </a>

          <NavLink
            to="/dashboard"
            style={navLinkStyles}
            className="bar-item button hide-medium hide-large"
            title="DASHBOARD"
          >
            <i className="fa fa-gear"></i>
          </NavLink>

          <div className="bar-item dropdown-hover button hide-medium hide-large">
            <i className="fa fa-globe"></i>
            <div
              className="dropdown-content"
              style={{
                position: "fixed",
                top: 0,
                marginLeft: 30,
                zIndex: 100,
                minWidth: 0,
              }}
            >
              <Switcher />
            </div>
          </div>
        </div>

        {showMenu && (
          <div className="bar-block white hide hide-large hide-medium show">
            <NavLink
              to="/subscribers"
              className="bar-item button"
              style={navLinkStyles}
              title="SUBSCRIBERS"
              onClick={() => setShowMenu(false)}
            >
              {t("nav.subscribers")}
            </NavLink>

            <NavLink
              to="/messages"
              className="bar-item button"
              style={navLinkStyles}
              onClick={() => setShowMenu(false)}
            >
              {t("nav.messages")}
            </NavLink>

            <NavLink
              to="/reservations"
              className="bar-item button"
              style={navLinkStyles}
              onClick={() => setShowMenu(false)}
            >
              {t("nav.reservations")}
            </NavLink>

            <NavLink
              to="/todos"
              className="bar-item button"
              style={navLinkStyles}
              onClick={() => setShowMenu(false)}
            >
              {t("nav.todos")}
            </NavLink>
          </div>
        )}
      </div>
    </>
  );
};

export default NavbarAdmin;
