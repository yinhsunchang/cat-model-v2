import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Navbar= () => {
  const { t } = useTranslation();

  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {setScrolled(window.scrollY > 100);};
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="top large">
      <div className={`bar ${scrolled ? "card animate-top white" : ""}`} id="myNavbar">
        <a className="bar-item button hide-medium hide-large right" href="#" onClick={() => setShowMenu(!showMenu)}>
          <i className="fa fa-bars"></i>
        </a>
        <a href="#home" className="bar-item button" style={{width:'25%'}}>{t("nav.home")}</a>
        <a href="#about" className="bar-item button hide-small" style={{width:'25%'}}><i className="fa fa-user"></i> {t("nav.about")}</a>
        <a href="#photos" className="bar-item button hide-small" style={{width:'25%'}}><i className="fa fa-th"></i> {t("nav.photos")}</a>
        <a href="#contact" className="bar-item button hide-small" style={{width:'25%'}}><i className="fa fa-envelope"></i> {t("nav.contact")}</a>
      </div>

      {showMenu && (
        <div className="bar-block white hide hide-large hide-medium show" id="navDemo">
          <a href="#about" className="bar-item button" onClick={() => setShowMenu(false)}>{t("nav.about")}</a>
          <a href="#photos" className="bar-item button" onClick={() => setShowMenu(false)}>{t("nav.photos")}</a>
          <a href="#contact" className="bar-item button" onClick={() => setShowMenu(false)}>{t("nav.contact")}</a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
