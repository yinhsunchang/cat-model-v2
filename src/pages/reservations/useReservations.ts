import { useContext } from "react";
import { ReservationsContext } from "./ReservationsContext";

export function useReservations() {
  const context = useContext(ReservationsContext);

  if (!context) {
    throw new Error("useReservations must be used within ReservationsProvider");
  }

  return context;
}
