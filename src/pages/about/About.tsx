import { useTranslation } from "react-i18next";
import SkillBar from "./SkillBar.tsx";
import StatCard from "./StatCard.tsx";
import PriceCard from "./PriceCard.tsx";
import Reputation from "./Reputation.tsx";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="content justify text-light-grey padding-64" id="about">
      <h2>{t("about.title")}</h2>
      <hr style={{ width: "200px" }} className="opacity" />
      <p className="large">
        <i className="fa fa-certificate margin-right"></i>
        {t("about.texts.race")}
      </p>
      <p className="large">
        <i className="fa fa-birthday-cake margin-right"></i>
        {t("about.texts.birthday")}
      </p>
      <p className="large">
        <i className="fa fa-home margin-right"></i>
        {t("about.texts.country")}
      </p>

      <h3 className="padding-16 text-light-grey">{t("about.skills.title")}</h3>
      <SkillBar label={t("about.skills.sleep")} percentage={95} />
      <SkillBar label={t("about.skills.play")} percentage={85} />
      <SkillBar label={t("about.skills.eat")} percentage={80} />
      <br />
      <StatCard />
      <PriceCard />
      <Reputation />
    </div>
  );
};

export default About;
