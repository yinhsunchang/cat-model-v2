import { supabase } from "../lib/supabase";
import type { FormProps } from "../types/reservations";

export const reservationService = {
  async getReservations(): Promise<FormProps[]> {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async deleteReservation(id: number): Promise<void> {
    const { error } = await supabase.from("reservations").delete().eq("id", id);

    if (error) throw error;
  },
};
