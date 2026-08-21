import { useState } from "react";
import { useSubscribers } from "./useSubscribers";
import type { Subscriber } from "../../types/subscriber";
import { useTranslation } from "react-i18next";

function Subscribers() {
  const { t } = useTranslation();

  const { subscribers, deleteSubscriber, editSubscriber, addSubscriber } =
    useSubscribers();

  const [newSubscriber, setNewSubscriber] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmedText = newSubscriber.trim();

    if (!trimmedText || adding) return;

    try {
      setError(null);
      setAdding(true);

      await addSubscriber(trimmedText);

      setNewSubscriber("");
    } catch (error) {
      console.error(error);
      setError(t("subscribers.addFailed"));
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSubscriber(id);
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  const handleEdit = async (id: number) => {
    const newText = prompt("Enter new text:");

    if (!newText?.trim()) return;

    try {
      await editSubscriber(id, newText);
    } catch (error) {
      console.error(error);
      alert("Edit failed");
    }
  };

  return (
    <>
      <div className="content white justify text-light-grey padding-32 round-large">
        {error && (
          <p className="margin padding large black round-large" role="alert">
            {error}
          </p>
        )}
        {subscribers.length === 0 ? (
          <p className="margin padding large black round-large">
            {t("subscribers.empty")}
          </p>
        ) : (
          subscribers.map((subscriber: Subscriber) => (
            <div
              key={subscriber.id}
              className="xlarge black padding margin round-large display-container"
            >
              <div
                style={{
                  display: "inline-block",
                }}
              >
                {subscriber.email}
              </div>

              <span className="hide-small">
                <button
                  className="button large grey padding margin-left round-large right"
                  style={{ maxWidth: "150px" }}
                  onClick={() => handleDelete(subscriber.id)}
                >
                  <i className="fa fa-trash xlarge"></i>
                  <span className="hide-small hide-medium">
                    {" "}
                    {t("subscribers.delete")}
                  </span>
                </button>
              </span>

              <span className="hide-small">
                <button
                  className="button large grey padding round-large right"
                  style={{ maxWidth: "125px" }}
                  onClick={() => handleEdit(subscriber.id)}
                >
                  <i className="fa fa-pencil xlarge"></i>
                  <span className="hide-small hide-medium">
                    {" "}
                    {t("subscribers.edit")}
                  </span>
                </button>
              </span>
            </div>
          ))
        )}

        {/* Add */}
        <div className="padding">
          <input
            className="input padding margin-bottom round-large"
            style={{ border: "2px solid #999" }}
            value={newSubscriber}
            placeholder={t("subscribers.placeholder")}
            onChange={(e) => setNewSubscriber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            className="button grey large padding block round-large"
            onClick={handleAdd}
          >
            <i className="fa fa-plus-circle large"></i> {t("subscribers.add")}
          </button>
        </div>
      </div>
    </>
  );
}

export default Subscribers;
