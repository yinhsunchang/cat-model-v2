import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../auth/useAuth";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignout = async () => {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    setLoading(false);

    if (error) {
      console.error("Sign out failed:", error);
      setError(t("dashboard.signoutError"));
      return;
    }

    navigate("/signin", { replace: true });
  };

  return (
    <div className="content justify text-light-grey padding-32" id="dashboard">
      <h2 className="padding-16">{t("dashboard.title")}</h2>
      <div className="content white justify padding-32 round-large">
        <div className="large black padding margin round-large">
          {error && <p role="alert">{error}</p>}
          <h2>{t("dashboard.profile")}</h2>
          <p>Email: {session?.user.email}</p>
        </div>

        <div className="padding">
          <button
            type="button"
            className="button grey padding large block round-large"
            onClick={handleSignout}
            disabled={loading}
          >
            {loading ? t("dashboard.signingout") : t("dashboard.signout")}
          </button>
        </div>
      </div>
    </div>
  );
}
