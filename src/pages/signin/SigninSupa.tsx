import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabase";

export default function Signin() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError(t("signin.required"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="content justify text-light-grey padding-64" id="signin">
      <h1>{t("signin.title")}</h1>

      <hr style={{ width: "200px" }} className="opacity" />

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">{t("signin.email")}</label>
        <input
          id="email"
          className="input large"
          type="email"
          placeholder={t("signin.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <label htmlFor="password">{t("signin.password")}</label>
        <input
          id="password"
          className="input margin-bottom large"
          type="password"
          placeholder={t("signin.passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {error && (
          <p className="text-red" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="button dark-grey padding large block"
          disabled={loading}
        >
          {loading ? t("signin.loading") : t("signin.signin")}
        </button>
      </form>

      <p className="medium">
        {t("signin.notyet")}
        <Link to="/signup" className="hover-text-white">
          {" "}
          {t("signin.signup")}
        </Link>
      </p>
    </div>
  );
}
