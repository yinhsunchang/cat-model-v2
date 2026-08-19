import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Switcher from "./Switcher.tsx";

const Navbar = () => {
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
        <div className={`bar ${scrolled ? "card animate-top white" : ""}`}>
          <button
            type="button"
            className="bar-item button hide-medium hide-large right"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Toggle navigation menu"
            aria-expanded={showMenu}
          >
            <i className="fa fa-bars" aria-hidden="true"></i>
          </button>

          <NavLink to="/" className="bar-item button" style={navLinkStyles}>
            <i className="fa fa-paw"></i>
          </NavLink>

          <div className="bar-item dropdown-hover button">
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

          <NavLink
            to="/contact"
            className="bar-item button hide-small right"
            style={navLinkStyles}
          >
            <i className="fa fa-envelope"></i> {t("nav.contact")}
          </NavLink>

          <a
            href="https://yinhsunchang.github.io/coming-soon"
            target="_blank"
            className="bar-item button hide-small right"
          >
            <i className="fa fa-shopping-bag"></i> {t("nav.shop")}
          </a>

          <NavLink
            to="/box"
            className="bar-item button hide-small right"
            style={navLinkStyles}
          >
            <i className="fa fa-archive"></i> {t("nav.box")}
          </NavLink>

          <NavLink
            to="/portfolio"
            className="bar-item button hide-small right"
            style={navLinkStyles}
          >
            <i className="fa fa-th"></i> {t("nav.portfolio")}
          </NavLink>
        </div>

        {showMenu && (
          <div className="bar-block white hide hide-large hide-medium show">
            <NavLink
              to="/portfolio"
              className="bar-item button"
              style={navLinkStyles}
              onClick={() => setShowMenu(false)}
            >
              {t("nav.portfolio")}
            </NavLink>

            <NavLink
              to="/box"
              className="bar-item button"
              style={navLinkStyles}
              onClick={() => setShowMenu(false)}
            >
              {t("nav.box")}
            </NavLink>

            <a
              href="https://yinhsunchang.github.io/coming-soon"
              target="_blank"
              className="bar-item button"
              onClick={() => setShowMenu(false)}
            >
              {t("nav.shop")}
            </a>

            <NavLink
              to="/contact"
              className="bar-item button"
              style={navLinkStyles}
              onClick={() => setShowMenu(false)}
            >
              {t("nav.contact")}
            </NavLink>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
