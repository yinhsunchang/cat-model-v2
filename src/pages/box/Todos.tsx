import { useTranslation } from "react-i18next";
import { useTodoStore } from "../../stores/todoStore";
import TodoItem from "./TodoItem";
import AddTodo from "./TodoAdd";

export default function Todos() {
  const { t } = useTranslation();
  const todos = useTodoStore((state) => state.todos);

  return (
    <div className="content padding-32">
      <h2 className="padding-16 text-light-grey">{t("films.title")}</h2>
      <div className="content white justify text-light-grey padding-32">
        {todos.length === 0 ? (
          <p className="margin padding large black round-large">
            {t("films.empty")}
          </p>
        ) : (
          <ul className="ul">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
        <AddTodo />
      </div>
    </div>
  );
}
