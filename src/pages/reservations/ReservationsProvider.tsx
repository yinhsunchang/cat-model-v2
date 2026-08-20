import { useEffect, useState, useCallback, useMemo } from "react";
import { reservationService } from "../../services/supaReservation";
import { ReservationsContext } from "./ReservationsContext";
import type { FormProps } from "../../types/reservations";
import { useTranslation } from "react-i18next";

export function ReservationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  const [reservations, setReservations] = useState<FormProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationService.getReservations();
        setReservations(data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const deleteReservation = useCallback(
    async (id: number) => {
      if (!window.confirm(t("confirm.delete"))) return;

      try {
        await reservationService.deleteReservation(id);
        setReservations((prev) =>
          prev.filter((reservation) => reservation.id !== id)
        );
      } catch (error) {
        console.error("Failed to delete reservation:", error);
        throw error;
      }
    },
    [t]
  );

  const value = useMemo(
    () => ({
      reservations,
      loading,
      deleteReservation,
    }),
    [reservations, loading, deleteReservation]
  );

  return (
    <ReservationsContext.Provider value={value}>
      {children}
    </ReservationsContext.Provider>
  );
}
