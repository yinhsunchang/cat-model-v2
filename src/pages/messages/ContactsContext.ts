import { createContext } from "react";
import type { FormProps } from "../../types/contacts";

export interface ContactsContextType {
  contacts: FormProps[];
  loading: boolean;
  deleteContact: (id: number) => Promise<void>;
}

export const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined
);
