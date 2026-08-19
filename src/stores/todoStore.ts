import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Todo } from "../types/todo";

export interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  editTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
}

const createId = () => Date.now();

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [
        { id: 0, text: "My Neighbor Totoro (1988)", done: false },
        { id: 1, text: "Cats (1998)", done: false },
        { id: 2, text: "The Cat Returns (2002)", done: false },
        { id: 3, text: "Garfield (2004)", done: false },
        { id: 4, text: "Puss in Boots (2011)", done: false },
        { id: 5, text: "Nine Lives (2016)", done: false },
        { id: 6, text: "A Street Cat named Bob (2016)", done: false },
        { id: 7, text: "Rudolf the Black Cat (2016)", done: false },
        {
          id: 8,
          text: "If Cats Disappeared from the World (2016)",
          done: false,
        },
        { id: 9, text: "The Travelling Cat Chronicles (2018)", done: false },
        { id: 10, text: "Flow (2024)", done: false },
      ],

      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: createId(),
              text,
              done: false,
            },
          ],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
          ),
        })),

      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
    }),

    { name: "todos" }
  )
);
