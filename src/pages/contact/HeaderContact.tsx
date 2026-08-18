// import { useTranslation } from "react-i18next";
import paw from "../../assets/paw.jpg";

const HeaderContact = () => {
  // const { t } = useTranslation();

  return (
    <header
      className="bgimg display-container opacity-min"
      style={{ backgroundImage: `url(${paw})` }}
    >
      <div className="display-middle">
        <span className="xxlarge text-white wide">CONTACT</span>
      </div>
    </header>
  );
};

export default HeaderContact;
