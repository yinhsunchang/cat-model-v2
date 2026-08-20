import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { subscriberService } from "../../services/supaSubscriber";
import { SubscribersContext } from "./SubscribersContext";
import type { Subscriber } from "../../types/subscriber";

export function SubscribersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const data = await subscriberService.getSubscribers();
        setSubscribers(data);
      } catch (error) {
        console.error("Failed to fetch subscribers:", error);
      }
    };

    fetchSubscribers();
  }, []);

  const addSubscriber = async (email: string) => {
    try {
      const newSubscriber = await subscriberService.addSubscriber(email);

      setSubscribers((prev) => [...prev, newSubscriber]);
    } catch (error) {
      console.error("Failed to add subscriber:", error);
      throw error;
    }
  };

  const editSubscriber = async (id: number, email: string) => {
    try {
      const updated = await subscriberService.updateSubscriber(id, {
        email,
      });

      setSubscribers((prev) =>
        prev.map((subscriber) => (subscriber.id === id ? updated : subscriber))
      );
    } catch (error) {
      console.error("Failed to edit subscriber:", error);
      throw error;
    }
  };

  const deleteSubscriber = async (id: number) => {
    if (!window.confirm(t("confirm.delete"))) {
      return;
    }

    try {
      await subscriberService.deleteSubscriber(id);

      setSubscribers((prev) =>
        prev.filter((subscriber) => subscriber.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
      throw error;
    }
  };

  return (
    <SubscribersContext.Provider
      value={{ subscribers, addSubscriber, deleteSubscriber, editSubscriber }}
    >
      {children}
    </SubscribersContext.Provider>
  );
}
