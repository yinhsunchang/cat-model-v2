import { useEffect, useState, useCallback, useMemo } from "react";
import { TodosContext } from "./TodosContext";
import { TodosAPI } from "./TodosAPI";
import { useTranslation } from "react-i18next";
import type { Todo } from "../../types/todo";

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await TodosAPI.getTodos();
        setTodos(data);
      } catch (error) {
        console.error("Failed to fetch Todos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = useCallback(async (text: string) => {
    try {
      const newTodo = await TodosAPI.create(text);

      setTodos((prev) => [...prev, newTodo]);
    } catch (error) {
      console.error("Failed to add todo:", error);
      throw error;
    }
  }, []);

  const toggleTodo = useCallback(
    async (id: number) => {
      try {
        const todo = todos.find((todo) => todo.id === id);

        if (!todo) {
          throw new Error("Todo not found");
        }

        const updated = await TodosAPI.update(id, {
          done: !todo.done,
        });
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updated : todo))
        );
      } catch (error) {
        console.error("Failed to toggle todo:", error);
        throw error;
      }
    },
    [todos]
  );

  const deleteTodo = useCallback(
    async (id: number) => {
      if (!window.confirm(t("confirm.delete"))) {
        return;
      }

      try {
        await TodosAPI.delete(id);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } catch (error) {
        console.error("Failed to delete todo:", error);
        throw error;
      }
    },
    [t]
  );

  const editTodo = useCallback(async (id: number, text: string) => {
    try {
      const updated = await TodosAPI.update(id, { text });

      setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));
    } catch (error) {
      console.error("Failed to edit todo:", error);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      todos,
      loading,
      addTodo,
      toggleTodo,
      deleteTodo,
      editTodo,
    }),
    [todos, loading, addTodo, toggleTodo, deleteTodo, editTodo]
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
}
