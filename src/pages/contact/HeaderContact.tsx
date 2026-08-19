import { useTranslation } from "react-i18next";
import paw from "../../assets/paw.jpg";

const HeaderContact = () => {
  const { t } = useTranslation();

  return (
    <header
      className="bgimg display-container opacity-min"
      style={{ backgroundImage: `url(${paw})` }}
    >
      <div className="display-middle">
        <span className="xxlarge wide light-grey text-dark-grey animate-fading">
          {t("header.contact")}
        </span>
      </div>
    </header>
  );
};

export default HeaderContact;
