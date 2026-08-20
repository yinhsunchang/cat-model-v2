import { useState } from "react";
import { useTranslation } from "react-i18next";

type AddTodoProps = {
  onAdd: (text: string) => Promise<void>;
};

function AddTodo({ onAdd }: AddTodoProps) {
  const { t } = useTranslation();

  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmedText = text.trim();

    if (!trimmedText || adding) return;

    try {
      setError(null);
      setAdding(true);

      await onAdd(trimmedText);

      setText("");
    } catch (error) {
      console.error(error);
      setError(t("todos.addFailed"));
    } finally {
      setAdding(false);
    }
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleAdd();
    }
    if (e.key === "Escape") {
      setText("");
    }
  }

  return (
    <div className="padding">
      {error && (
        <p className="black padding round-large" role="alert">
          {error}
        </p>
      )}
      <input
        className="input padding margin-bottom round-large"
        style={{ border: "2px solid #999" }}
        placeholder={t("todos.placeholder")}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={adding}
      />

      <button
        type="button"
        className="button grey large padding block round-large"
        onClick={handleAdd}
        disabled={adding || !text.trim()}
      >
        <i className="fa fa-plus-circle large"></i>{" "}
        {adding ? t("todos.adding") : t("todos.add")}
      </button>
    </div>
  );
}

export default AddTodo;
