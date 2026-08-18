import { useTranslation } from "react-i18next";

function Switcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <>
      <div>
        <button className="button black" onClick={() => changeLanguage("en")}>
          EN
        </button>
        <button className="button black" onClick={() => changeLanguage("fr")}>
          FR
        </button>
      </div>
    </>
  );
}

export default Switcher;
