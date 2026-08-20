import { useState } from "react";
import { useReservations } from "./useReservations";
import { useTranslation } from "react-i18next";

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function Reservations() {
  const { t } = useTranslation();

  const { reservations, loading, deleteReservation } = useReservations();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      setDeletingId(id);
      await deleteReservation(id);
    } catch {
      setError(t("reservations.deleteFailed"));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  return (
    <>
      <div className="content white justify text-light-grey padding-32 round-large">
        {error && (
          <p className="margin padding large black round-large" role="alert">
            {error}
          </p>
        )}

        {reservations.length === 0 ? (
          <p className="margin padding large black round-large">
            {t("reservations.empty")}
          </p>
        ) : (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="large black padding margin round-large display-container"
            >
              <div>
                <p>Name: {reservation.name}</p>
                <p>Email: {reservation.email}</p>
                <p>Date: {formatDate(reservation.date)}</p>
                <p>Message: {reservation.message}</p>
                <p>
                  <small>{formatDate(reservation.created_at)}</small>
                </p>
              </div>

              <button
                type="button"
                className="button large grey margin-bottom block round-large"
                onClick={() => handleDelete(reservation.id)}
                disabled={deletingId === reservation.id}
              >
                <i className="fa fa-trash xlarge"></i>{" "}
                {deletingId === reservation.id
                  ? t("reservations.deleting")
                  : t("reservations.delete")}
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Reservations;
