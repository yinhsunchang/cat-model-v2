import { useTranslation } from "react-i18next";
import front from '../assets/front.jpg';

const Header = () => {
  const { t } = useTranslation();
  
  return (
  <header className="bgimg-1 display-container" style={{backgroundImage: `url(${front})`}} id="home">
    <div className="display-middle" style={{ whiteSpace: "nowrap" }}>
    <span className="center wide animate-opacity">
    <h1 className="jumbo"><mark className="hide-small">{t("header.greeting")}</mark> {t("header.name")}</h1>
    <p className="xlarge">{t("header.subtitle")}</p>
    </span>
    </div>
  </header>
  );
}

export default Header
