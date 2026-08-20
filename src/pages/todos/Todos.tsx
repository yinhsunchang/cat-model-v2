import { useTranslation } from "react-i18next";
import { TodosProvider } from "./TodosProvider";
import TodosUseContext from "./TodosUseContext";

function Todos() {
  const { t } = useTranslation();

  return (
    <div className="content padding-32">
      <h2 className="padding-16">{t("todos.title")}</h2>
      <TodosProvider>
        <TodosUseContext />
      </TodosProvider>
    </div>
  );
}

export default Todos;
