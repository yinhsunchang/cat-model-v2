import { useState } from "react";
import { useTodoStore } from "../../stores/todoStore";
import type { Todo } from "../../types/todo";
import { useTranslation } from "react-i18next";

interface Props {
  todo: Todo;
}

export default function TodoItem({ todo }: Props) {
  const { t } = useTranslation();

  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const editTodo = useTodoStore((state) => state.editTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  function handleSaveEdit() {
    if (!draft.trim()) return;

    editTodo(todo.id, draft.trim());
    setEditing(false);
  }

  function handleCancelEdit() {
    setDraft(todo.text);
    setEditing(false);
  }

  function handleDelete() {
    const confirmed = window.confirm(t("confirm.delete"));

    if (!confirmed) return;

    deleteTodo(todo.id);
  }

  return (
    <li className="xlarge black margin">
      <label>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => toggleTodo(todo.id)}
          className="xxlarge margin-right"
          style={{
            width: 20,
            height: 20,
            border: "2px solid #999",
          }}
        />

        {editing ? (
          <>
            <input
              className="input light-grey"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveEdit();
                }

                if (e.key === "Escape") {
                  handleCancelEdit();
                }
              }}
            />

            <button
              className="button block grey large"
              onClick={handleSaveEdit}
            >
              <i className="fa fa-save xlarge"></i> {t("films.save")}
            </button>
          </>
        ) : (
          <>
            <span
              style={{
                textDecoration: todo.done ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>

            <button
              className="button block light-grey large"
              onClick={() => {
                setDraft(todo.text);
                setEditing(true);
              }}
            >
              <i className="fa fa-pencil large"></i> {t("films.edit")}
            </button>

            <button
              className="button block light-grey large"
              onClick={handleDelete}
            >
              <i className="fa fa-trash large"></i> {t("films.delete")}
            </button>
          </>
        )}
      </label>
    </li>
  );
}
