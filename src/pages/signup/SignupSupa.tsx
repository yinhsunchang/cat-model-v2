import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabase";

export default function Signup() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError(t("signup.required"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(t("signup.success"));
    setPassword("");
  };

  return (
    <div className="content justify text-light-grey padding-64" id="signup">
      <h1>{t("signup.title")}</h1>

      <hr style={{ width: "200px" }} className="opacity" />

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">{t("signup.email")}</label>
        <input
          id="email"
          className="input large"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <label htmlFor="password">{t("signup.password")}</label>
        <input
          id="password"
          className="input margin-bottom large"
          type="password"
          placeholder={t("signup.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {error && (
          <p className="text-red" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green" role="status">
            {success}
          </p>
        )}

        <button
          type="submit"
          className="button dark-grey padding large block"
          disabled={loading}
        >
          {loading ? t("signup.loading") : t("signup.signup")}
        </button>
      </form>

      <p className="medium">
        {t("signup.already")}
        <Link to="/signin" className="hover-text-white">
          {" "}
          {t("signup.signin")}
        </Link>
      </p>
    </div>
  );
}
