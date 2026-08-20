import { render, waitFor } from "@testing-library/react";

import { useTodos } from "./useTodos";
import { TodosProvider } from "./TodosProvider";
import { TodosAPI } from "./TodosAPI";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./TodosAPI", () => ({
  TodosAPI: {
    getTodos: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useTodos", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(TodosAPI.getTodos).mockResolvedValue([]);
  });

  it("should return the Todos context when used inside TodosProvider", async () => {
    function TestComponent() {
      const { todos, loading, addTodo, toggleTodo, deleteTodo, editTodo } =
        useTodos();

      return (
        <div>
          <span data-testid="todos-count">{todos.length}</span>

          <span data-testid="loading">{loading ? "loading" : "loaded"}</span>

          <span data-testid="add-todo">
            {typeof addTodo === "function" ? "available" : "missing"}
          </span>

          <span data-testid="toggle-todo">
            {typeof toggleTodo === "function" ? "available" : "missing"}
          </span>

          <span data-testid="delete-todo">
            {typeof deleteTodo === "function" ? "available" : "missing"}
          </span>

          <span data-testid="edit-todo">
            {typeof editTodo === "function" ? "available" : "missing"}
          </span>
        </div>
      );
    }

    const { getByTestId } = render(
      <TodosProvider>
        <TestComponent />
      </TodosProvider>
    );

    // Initial state
    expect(getByTestId("loading")).toHaveTextContent("loading");

    await waitFor(() => {
      expect(getByTestId("loading")).toHaveTextContent("loaded");
    });

    expect(getByTestId("todos-count")).toHaveTextContent("0");

    expect(getByTestId("add-todo")).toHaveTextContent("available");
    expect(getByTestId("toggle-todo")).toHaveTextContent("available");
    expect(getByTestId("delete-todo")).toHaveTextContent("available");
    expect(getByTestId("edit-todo")).toHaveTextContent("available");

    expect(TodosAPI.getTodos).toHaveBeenCalledTimes(1);
  });

  it("should throw an error when used outside TodosProvider", () => {
    function TestComponent() {
      useTodos();

      return null;
    }

    expect(() => render(<TestComponent />)).toThrow(
      "useTodos must be used within TodosProvider"
    );
  });
});
