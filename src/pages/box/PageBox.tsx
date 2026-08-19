import HeaderBox from "./HeaderBox.tsx";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const navLinkStyles = ({ isActive }: { isActive: boolean }) => ({
  backgroundColor: isActive ? "#000" : "#fff",
  color: isActive ? "#fff" : "#333",
  width: "50%",
});

const PageBox = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeaderBox />
      <nav
        className="bar center light-grey"
        style={{ position: "sticky", top: 48, zIndex: 100 }}
      >
        <NavLink
          to="/box/encyclopedia"
          className="bar-item button large"
          style={navLinkStyles}
        >
          <i className="fa fa-book"></i> {t("nav.encyclopedia")}
        </NavLink>
        <NavLink
          to="/box/films"
          className="bar-item button large"
          style={navLinkStyles}
        >
          <i className="fa fa-film"></i> {t("nav.films")}
        </NavLink>
      </nav>
      <Outlet />
    </>
  );
};

export default PageBox;
