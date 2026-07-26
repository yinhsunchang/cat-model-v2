import { useTranslation } from "react-i18next";
import SkillBar from "./SkillBar.tsx";
import StatCard from "./StatCard.tsx";
import ephrem from "../assets/ephrem255.jpg";
import yinhsun from "../assets/yinhsun255.jpg";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="content justify text-light-grey padding-64" id="about">
      <h2>{t("about.title")}</h2>
      <hr style={{ width: "200px" }} className="opacity" />
      <i className="fa fa-certificate xxlarge"></i>
      <p>{t("about.texts.race")}</p>
      <i className="fa fa-birthday-cake xxlarge"></i>
      <p>{t("about.texts.birthday")}</p>
      <i className="fa fa-home xxlarge"></i>
      <p>{t("about.texts.country")}</p>

      <h3 className="padding-16 text-light-grey">{t("about.skills.title")}</h3>
      <SkillBar label={t("about.skills.sleep")} percentage={95} />
      <SkillBar label={t("about.skills.play")} percentage={85} />
      <SkillBar label={t("about.skills.eat")} percentage={80} />
      <br />
      <StatCard />

      <h3 className="padding-16 text-light-grey">{t("about.price.title")}</h3>
      <div className="row-padding" style={{ margin: "0 -16px" }}>
        <div className="half margin-bottom">
          <ul className="ul white center opacity hover-opacity-off">
            <li className="dark-grey xlarge padding-32">
              {t("about.price.basic")}
            </li>
            <li className="padding-16">
              <h2>$ 20</h2>
              <span className="opacity">{t("about.price.time")}</span>
            </li>
          </ul>
        </div>

        <div className="half">
          <ul className="ul white center opacity hover-opacity-off">
            <li className="dark-grey xlarge padding-32">
              {t("about.price.pro")}
            </li>
            <li className="padding-16">
              <h2>$ 30</h2>
              <span className="opacity">{t("about.price.time")}</span>
            </li>
          </ul>
        </div>
      </div>

      <h3 className="padding-24 text-light-grey">
        {t("about.reputation.title")}
      </h3>
      <img
        src={ephrem}
        alt="Avatar"
        className="left circle margin-right"
        style={{ width: "80px" }}
      />
      <p>
        <span className="large margin-right">
          {t("about.reputation.temoin1")}
        </span>
        {t("about.reputation.job1")}
      </p>
      <p>{t("about.reputation.text1")}</p>

      <br />

      <img
        src={yinhsun}
        alt="Avatar"
        className="left circle margin-right"
        style={{ width: "80px" }}
      />
      <p>
        <span className="large margin-right">
          {t("about.reputation.temoin2")}
        </span>
        {t("about.reputation.job2")}
      </p>
      <p>{t("about.reputation.text2")}</p>
    </div>
  );
};

export default About;
