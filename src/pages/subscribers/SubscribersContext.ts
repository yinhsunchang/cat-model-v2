import { createContext } from "react";
import type { Subscriber } from "../../types/subscriber";

export interface SubscribersContextType {
  subscribers: Subscriber[];
  addSubscriber: (email: string) => Promise<void>;
  deleteSubscriber: (id: number) => Promise<void>;
  editSubscriber: (id: number, email: string) => Promise<void>;
}

export const SubscribersContext = createContext<
  SubscribersContextType | undefined
>(undefined);
