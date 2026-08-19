import { useState } from "react";
import { useTodoStore } from "../../stores/todoStore";
import { useTranslation } from "react-i18next";

export default function AddTodo() {
  const { t } = useTranslation();

  const [text, setText] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  function handleAddTodo() {
    addTodo(text.trim());
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleAddTodo();
    }
    if (e.key === "Escape") {
      setText("");
    }
  }

  return (
    <div className="padding">
      <input
        className="input padding margin-bottom"
        style={{ border: "2px solid #999" }}
        placeholder={t("films.placeholder")}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        className="button grey large padding block"
        onClick={handleAddTodo}
      >
        <i className="fa fa-plus-circle large"></i> {t("films.add")}
      </button>
    </div>
  );
}
