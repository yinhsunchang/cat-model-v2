import { useState } from "react";
import type { Todo } from "../../types/todo";
import { useTranslation } from "react-i18next";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, text: string) => Promise<void>;
};

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const { t } = useTranslation();

  const [editing, setEditing] = useState(false);
  const [editingText, setEditingText] = useState(todo.text);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartEdit = () => {
    setEditingText(todo.text);
    setError(null);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingText(todo.text);
    setError(null);
    setEditing(false);
  };

  const handleSaveEdit = async () => {
    const text = editingText.trim();

    if (!text || saving) return;

    try {
      setError(null);
      setSaving(true);

      await onEdit(todo.id, text);

      setEditing(false);
    } catch (error) {
      console.error(error);
      setError(t("todos.editFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;

    try {
      setError(null);
      setDeleting(true);

      await onDelete(todo.id);
    } catch (error) {
      console.error(error);
      setError(t("todos.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    try {
      setError(null);
      await onToggle(todo.id);
    } catch (error) {
      console.error(error);
      setError(t("todos.updateFailed"));
    }
  };

  return (
    <>
      {error && <p role="alert">{error}</p>}

      <div className="xlarge black padding margin round-large">
        <label>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={handleToggle}
            className="xxlarge margin-right hide-small"
            style={{
              width: 20,
              height: 20,
              border: "2px solid #999",
            }}
            disabled={editing || saving || deleting}
          />

          {editing ? (
            <>
              <input
                className="input padding margin-bottom round-large"
                value={editingText}
                autoFocus
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveEdit();
                  }

                  if (e.key === "Escape") {
                    handleCancelEdit();
                  }
                }}
              />
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
            </>
          )}
        </label>

        {editing ? (
          <>
            <button
              type="button"
              className="button large grey margin-bottom block round-large"
              onClick={handleSaveEdit}
              disabled={!editingText.trim() || saving}
            >
              <i className="fa fa-check xlarge" />
              <span className="hide-small hide-medium">
                {" "}
                {saving ? t("todos.saving") : t("todos.save")}
              </span>
            </button>

            <button
              type="button"
              className="button large grey margin-bottom block round-large"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              <i className="fa fa-times xlarge" />
              <span className="hide-small hide-medium">
                {" "}
                {t("todos.cancel")}
              </span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="button large grey right round-large"
              onClick={handleDelete}
              disabled={deleting}
            >
              <i className="fa fa-trash xlarge" />
              <span className="hide-small hide-medium">
                {" "}
                {deleting ? t("todos.deleting") : t("todos.delete")}
              </span>
            </button>

            <button
              type="button"
              className="button large grey right margin-right round-large"
              onClick={handleStartEdit}
              disabled={deleting}
            >
              <i className="fa fa-pencil xlarge" />
              <span className="hide-small hide-medium"> {t("todos.edit")}</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default TodoItem;
