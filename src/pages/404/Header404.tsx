import { useTranslation } from "react-i18next";
import oops from "../../assets/oops.jpg";

const HeaderNotFound = () => {
  const { t } = useTranslation();

  return (
    <header
      className="bgimg display-container opacity-min"
      style={{ backgroundImage: `url(${oops})` }}
    >
      <div style={{ position: "absolute", right: 0, bottom: 220 }}>
        <h1 className="xxlarge white wide padding animate-left">
          {t("404.title1")}
        </h1>
        <p className="xlarge white wide padding animate-right">
          {t("404.title2")}{" "}
        </p>
      </div>
      <div
        style={{ position: "absolute", right: 0, bottom: 20 }}
        className="hide-small"
      >
        <p
          className="xlarge black wide padding animate-left"
          style={{ margin: 0 }}
        >
          {t("404.p1")}
        </p>
        <p
          className="large black wide padding animate-right"
          style={{ margin: 0 }}
        >
          {t("404.p2")}
        </p>
        <p
          className="large black wide padding animate-left"
          style={{ margin: 0 }}
        >
          {t("404.p3")}
        </p>
        <p
          className="large black wide padding animate-right"
          style={{ margin: 0 }}
        >
          {t("404.p4")}
        </p>
      </div>
    </header>
  );
};

export default HeaderNotFound;
