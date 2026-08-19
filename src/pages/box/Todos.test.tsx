import { render, screen } from "@testing-library/react";
import Todos from "./Todos";
import type { TodoStore } from "../../stores/todoStore";

let mockTodos = [
  { id: 1, text: "Movie A", done: false },
  { id: 2, text: "Movie B", done: true },
];

vi.mock("../../stores/todoStore", () => ({
  useTodoStore: (selector: (store: TodoStore) => unknown) =>
    selector({
      todos: mockTodos,
      addTodo: vi.fn(),
      toggleTodo: vi.fn(),
      editTodo: vi.fn(),
      deleteTodo: vi.fn(),
    }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "films.title": "Films",
        "films.empty": "No films",
        "films.placeholder": "Add a movie...",
        "films.add": "Add",
      };

      return translations[key] ?? key;
    },
  }),
}));

describe("Todos", () => {
  beforeEach(() => {
    mockTodos = [
      { id: 1, text: "Movie A", done: false },
      { id: 2, text: "Movie B", done: true },
    ];
  });

  it("renders all todos", () => {
    render(<Todos />);

    expect(screen.getByText("Movie A")).toBeInTheDocument();
    expect(screen.getByText("Movie B")).toBeInTheDocument();
  });

  it("renders empty message when there are no todos", () => {
    mockTodos = [];

    render(<Todos />);

    expect(screen.getByText("No films")).toBeInTheDocument();
  });
});
