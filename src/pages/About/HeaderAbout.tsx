import { useTranslation } from "react-i18next";
import sink1 from "../../assets/sink1.jpg";

const HeaderAbout = () => {
  const { t } = useTranslation();

  return (
    <header
      className="bgimg display-container opacity-min"
      style={{ backgroundImage: `url(${sink1})` }}
    >
      <div className="display-middle" style={{ whiteSpace: "nowrap" }}>
        <span className="center animate-opacity">
          <h1 className="jumbo wide">
            <mark className="hide-small">{t("header.greeting")}</mark>{" "}
            {t("header.name")}
          </h1>
          <p className="xlarge">{t("header.subtitle")}</p>
        </span>
      </div>
    </header>
  );
};

export default HeaderAbout;
