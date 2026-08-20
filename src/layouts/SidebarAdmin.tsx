import { NavLink } from "react-router-dom";
import Switcher from "./Switcher.tsx";
import { useTranslation } from "react-i18next";

const SidebarAdmin = () => {
  const { t } = useTranslation();

  const navLinkStyles = ({ isActive }: { isActive: boolean }) => ({
    backgroundColor: isActive ? "#ccc" : "#000",
    color: isActive ? "#000" : "#ccc",
  });

  return (
    <nav className="sidebar bar-block small hide-small center">
      <NavLink
        to="/dashboard"
        style={navLinkStyles}
        className="bar-item button"
        title="DASHBOARD"
      >
        <i className="fa fa-gear xlarge padding"></i>
        <p>{t("nav.dashboard")}</p>
      </NavLink>

      <NavLink
        to="/subscribers"
        style={navLinkStyles}
        className="bar-item button"
        title="SUBSCRIBERS"
      >
        <i className="fa fa-user-plus xlarge padding"></i>
        <p>{t("nav.subscribers")}</p>
      </NavLink>

      <NavLink
        to="/messages"
        style={navLinkStyles}
        className="bar-item button"
        title="MESSAGES"
      >
        <i className="fa fa-commenting xlarge padding"></i>
        <p>{t("nav.messages")}</p>
      </NavLink>

      <NavLink
        to="/reservations"
        style={navLinkStyles}
        className="bar-item button"
        title="RESERVATIONS"
      >
        <i className="fa fa-camera xlarge padding"></i>
        <p>{t("nav.reservations")}</p>
      </NavLink>

      <NavLink
        to="/todos"
        style={navLinkStyles}
        className="bar-item button"
        title="TODOS"
      >
        <i className="fa fa-edit xlarge padding"></i>
        <p>{t("nav.todos")}</p>
      </NavLink>

      <div
        className="bar-item dropdown-hover button hover-black"
        style={{ position: "fixed", bottom: 0, left: 0, width: 120 }}
        title="LANGUAGES"
      >
        <i className="fa fa-globe xlarge"></i>
        <p>{t("nav.languages")}</p>
        <div
          className="dropdown-content"
          style={{ position: "relative", zIndex: 100, minWidth: 0 }}
        >
          <Switcher />
        </div>
      </div>
    </nav>
  );
};

export default SidebarAdmin;
