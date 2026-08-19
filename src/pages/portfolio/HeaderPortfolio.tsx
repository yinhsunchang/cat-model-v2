import { useTranslation } from "react-i18next";
import sink2 from "../../assets/sink2.jpg";

const HeaderPortfolio = () => {
  const { t } = useTranslation();

  return (
    <header
      className="bgimg display-container opacity-min"
      style={{ backgroundImage: `url(${sink2})` }}
    >
      <div className="display-middle">
        <span className="xxlarge wide light-grey text-dark-grey animate-fading">
          {t("header.portfolio")}
        </span>
      </div>
    </header>
  );
};

export default HeaderPortfolio;
