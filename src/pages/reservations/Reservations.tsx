import { ReservationsProvider } from "./ReservationsProvider";
import ReservationsUseContext from "./ReservationsUseContext";
import { useTranslation } from "react-i18next";

function Reservations() {
  const { t } = useTranslation();

  return (
    <div className="content padding-32">
      <h2 className="padding-16">{t("reservations.title")}</h2>
      <ReservationsProvider>
        <ReservationsUseContext />
      </ReservationsProvider>
    </div>
  );
}

export default Reservations;
