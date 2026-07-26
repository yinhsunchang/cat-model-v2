import { useTranslation } from "react-i18next";
import ContactForm from "./ContactForm";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="padding-64 content text-light-grey" id="contact">
      <h2>{t("contact.title")}</h2>
      <hr style={{ width: "200px" }} className="opacity" />
      <div className="section">
        <p>
          <i className="fa fa-map-marker fa-fw text-white xlarge margin-right"></i>{" "}
          {t("contact.address")}
        </p>
        <p>
          <i className="fa fa-phone fa-fw text-white xlarge margin-right"></i>{" "}
          {t("contact.phone")}
        </p>
        <p>
          <i className="fa fa-envelope fa-fw text-white xlarge margin-right">
            {" "}
          </i>{" "}
          {t("contact.email")}
        </p>
      </div>

      <br />

      <ContactForm />
    </div>
  );
};

export default Contact;
