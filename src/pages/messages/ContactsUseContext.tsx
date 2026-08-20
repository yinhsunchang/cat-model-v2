import { useState } from "react";
import { useContacts } from "./useContacts";
import { useTranslation } from "react-i18next";

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function Contacts() {
  const { t } = useTranslation();

  const { contacts, loading, deleteContact } = useContacts();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      setDeletingId(id);
      await deleteContact(id);
    } catch {
      setError(t("messages.deleteFailed"));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  return (
    <>
      <div className="content white justify text-light-grey padding-32 round-large">
        {error && (
          <p className="margin padding large black round-large" role="alert">
            {error}
          </p>
        )}

        {contacts.length === 0 ? (
          <p className="margin padding large black round-large">
            {t("messages.empty")}
          </p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="large black padding margin round-large display-container"
            >
              <div>
                <p>Name: {contact.name}</p>
                <p>Email: {contact.email}</p>
                <p>Subject: {contact.subject}</p>
                <p>Message: {contact.message}</p>
                <p>
                  <small>{formatDate(contact.created_at)}</small>
                </p>
              </div>

              <button
                type="button"
                className="button large grey margin-bottom block round-large"
                onClick={() => handleDelete(contact.id)}
                disabled={deletingId === contact.id}
              >
                <i className="fa fa-trash xlarge"></i>{" "}
                {deletingId === contact.id
                  ? t("messages.deleting")
                  : t("messages.delete")}
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Contacts;
