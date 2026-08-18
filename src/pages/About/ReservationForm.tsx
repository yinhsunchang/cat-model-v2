import { useState } from "react";
import { sendReservationForm } from "../../services/reservation";
import type { FormProps } from "../../types/reservation";
import { useTranslation } from "react-i18next";

const ReservationForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormProps>({
    name: "",
    email: "",
    date: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendReservationForm(form);
      setSuccess(t("about.reserve.success"));
      setForm({ name: "", email: "", date: "", message: "" });
    } catch (err) {
      console.error(err);
      setError(t("about.reserve.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p>
          <input
            className="input padding-16 border"
            type="text"
            name="name"
            aria-label="name"
            value={form.name}
            placeholder={t("about.reserve.name")}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </p>

        <p>
          <input
            className="input padding-16 border"
            type="email"
            name="email"
            aria-label="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            disabled={loading}
            required
          />
        </p>

        <p>
          <input
            className="input padding-16 border"
            type="datetime-local"
            name="date"
            aria-label="date"
            value={form.date}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </p>

        <p>
          <input
            className="input padding-16 border"
            type="text"
            name="message"
            aria-label="message"
            value={form.message}
            placeholder="Message"
            onChange={handleChange}
            disabled={loading}
            required
          />
        </p>

        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>
          <button
            className="button black padding-16 margin-bottom"
            type="submit"
            disabled={loading}
          >
            <i className="fa fa-paper-plane" aria-hidden="true"></i>
            {loading ? "Sending..." : t("about.reserve.send")}
          </button>
        </p>
      </form>
    </>
  );
};

export default ReservationForm;
