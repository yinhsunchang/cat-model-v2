import { useState } from "react";
import { useTranslation } from "react-i18next";
import { sendContactForm } from "../services/contact";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Status {
  success: boolean;
  message: string;
}

const Contact = () => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData: FormData = {
      name: (form.elements.namedItem("Name") as HTMLInputElement).value,
      email: (form.elements.namedItem("Email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("Subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("Message") as HTMLInputElement).value,
    };

    setLoading(true);
    setStatus(null);

    try {
      await sendContactForm(formData);
      setStatus({ success: true, message: "Message sent successfully!" });
      (form.elements.namedItem("Name") as HTMLInputElement).value = "";
      (form.elements.namedItem("Email") as HTMLInputElement).value = "";
      (form.elements.namedItem("Subject") as HTMLInputElement).value = "";
      (form.elements.namedItem("Message") as HTMLInputElement).value = "";
    } catch (err) {
      setStatus({ success: false, message: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

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

      <p>{t("contact.sendMessage")}</p>
      <form onSubmit={handleSubmit}>
        <p>
          <input
            className="input padding-16"
            type="text"
            placeholder={t("contact.placeholder.name")}
            required
            name="Name"
          />
        </p>
        <p>
          <input
            className="input padding-16"
            type="email"
            placeholder={t("contact.placeholder.email")}
            required
            name="Email"
          />
        </p>
        <p>
          <input
            className="input padding-16"
            type="text"
            placeholder={t("contact.placeholder.subject")}
            required
            name="Subject"
          />
        </p>
        <p>
          <input
            className="input padding-16"
            type="text"
            placeholder={t("contact.placeholder.message")}
            required
            name="Message"
          />
        </p>
        <p>
          <button
            className="button light-grey padding-large"
            type="submit"
            disabled={loading}
          >
            <i className="fa fa-paper-plane"></i>
            {t("contact.sendButton")}
          </button>
        </p>
      </form>

      <p style={{ marginTop: "1em", color: "white" }}>
        {loading ? "Sending..." : ""}
      </p>
      {status && (
        <p
          style={{
            marginTop: "1em",
            color: status.success ? "lightgreen" : "red",
          }}
        >
          {status.message}
        </p>
      )}
    </div>
  );
};

export default Contact;
