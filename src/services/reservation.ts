import { supabase } from "../lib/supabase";
import type { FormProps } from "../types/reservation";

export async function sendReservationForm(form: FormProps): Promise<void> {
  const { error } = await supabase.from("reservations").insert(form);

  if (error) {
    throw error;
  }
}
