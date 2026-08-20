import { supabase } from "../lib/supabase";
import type { Subscriber } from "../types/subscriber";

export const subscriberService = {
  async getSubscribers(): Promise<Subscriber[]> {
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async addSubscriber(email: string): Promise<Subscriber> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Please sign in first!");
    }

    const { data, error } = await supabase
      .from("subscribers")
      .insert({ email })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateSubscriber(
    id: number,
    updates: Partial<Subscriber>
  ): Promise<Subscriber> {
    const { data, error } = await supabase
      .from("subscribers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async deleteSubscriber(id: number): Promise<void> {
    const { error } = await supabase.from("subscribers").delete().eq("id", id);

    if (error) throw error;
  },
};
