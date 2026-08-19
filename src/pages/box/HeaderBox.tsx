import { useTranslation } from "react-i18next";
import reading from "../../assets/reading.jpg";

const HeaderBox = () => {
  const { t } = useTranslation();

  return (
    <header
      className="bgimg display-container opacity-min"
      style={{ backgroundImage: `url(${reading})` }}
    >
      <div className="display-middle">
        <span className="xxlarge wide light-grey text-dark-grey animate-fading">
          {t("header.box")}
        </span>
      </div>
    </header>
  );
};

export default HeaderBox;
