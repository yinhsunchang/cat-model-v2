import sink2 from "../../assets/sink2.jpg";
// import { useTranslation } from "react-i18next";

const HeaderPortfolio = () => {
  // const { t } = useTranslation();

  return (
    <header
      className="bgimg display-container opacity-min"
      style={{ backgroundImage: `url(${sink2})` }}
    >
      <div className="display-middle">
        <span className="xxlarge text-white wide">PORTFOLIO</span>
      </div>
    </header>
  );
};

export default HeaderPortfolio;
