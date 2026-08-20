import { createContext } from "react";
import type { FormProps } from "../../types/reservations";

export interface ReservationsContextType {
  reservations: FormProps[];
  loading: boolean;
  deleteReservation: (id: number) => Promise<void>;
}

export const ReservationsContext = createContext<
  ReservationsContextType | undefined
>(undefined);
