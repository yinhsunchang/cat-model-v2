import { createContext } from "react";
import type { Todo } from "../../types/todo";

export interface TodosContextType {
  todos: Todo[];
  loading: boolean;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  editTodo: (id: number, text: string) => Promise<void>;
}

export const TodosContext = createContext<TodosContextType | undefined>(
  undefined
);
