import { supabase } from "../lib/supabase";
import type { FormProps } from "../types/form";

export async function sendContactForm(form: FormProps): Promise<void> {
  const { error } = await supabase.from("contacts").insert(form);

  if (error) {
    throw error;
  }
}
