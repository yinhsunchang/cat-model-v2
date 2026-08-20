import { useTodos } from "./useTodos";
import { useTranslation } from "react-i18next";
import TodoItem from "./TodoItem";
import AddTodo from "./TodoAdd";

function Todos() {
  const { t } = useTranslation();

  const { todos, loading, addTodo, deleteTodo, editTodo, toggleTodo } =
    useTodos();

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  return (
    <>
      <div className="content white justify text-light-grey padding-32 round-large">
        {/* TodoItem */}
        {todos.length === 0 ? (
          <p className="margin padding large black round-large">
            {t("todos.empty")}
          </p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}

        <AddTodo onAdd={addTodo} />
      </div>
    </>
  );
}

export default Todos;
