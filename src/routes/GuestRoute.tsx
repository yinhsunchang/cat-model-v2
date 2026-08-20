import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/useAuth";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { session, loading } = useAuth();

  if (loading) {
    return <div role="status">{t("guestRoute.loading")}</div>;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
