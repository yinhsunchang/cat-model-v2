import { render, screen } from "@testing-library/react";
import Todos from "./Todos";
import type { Todo } from "../../types/todo";

const mockUseTodos = vi.fn();

vi.mock("./useTodos", () => ({
  useTodos: () => mockUseTodos(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./TodoItem", () => ({
  default: ({
    todo,
  }: {
    todo: Todo;
    onToggle: (id: number) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onEdit: (id: number, text: string) => Promise<void>;
  }) => <div data-testid={`todo-item-${todo.id}`}>{todo.text}</div>,
}));

vi.mock("./TodoAdd", () => ({
  default: ({ onAdd }: { onAdd: (text: string) => Promise<void> }) => (
    <button type="button" onClick={() => onAdd("New todo")}>
      Add Todo
    </button>
  ),
}));

const mockTodos: Todo[] = [
  {
    id: 1,
    text: "Buy milk",
    done: false,
  },
  {
    id: 2,
    text: "Learn React",
    done: true,
  },
];

describe("Todos", () => {
  const mockAddTodo = vi.fn();
  const mockDeleteTodo = vi.fn();
  const mockEditTodo = vi.fn();
  const mockToggleTodo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseTodos.mockReturnValue({
      todos: mockTodos,
      loading: false,
      addTodo: mockAddTodo,
      deleteTodo: mockDeleteTodo,
      editTodo: mockEditTodo,
      toggleTodo: mockToggleTodo,
    });
  });

  it("should show loading state", () => {
    mockUseTodos.mockReturnValue({
      todos: [],
      loading: true,
      addTodo: mockAddTodo,
      deleteTodo: mockDeleteTodo,
      editTodo: mockEditTodo,
      toggleTodo: mockToggleTodo,
    });

    render(<Todos />);

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("should show empty state when there are no todos", () => {
    mockUseTodos.mockReturnValue({
      todos: [],
      loading: false,
      addTodo: mockAddTodo,
      deleteTodo: mockDeleteTodo,
      editTodo: mockEditTodo,
      toggleTodo: mockToggleTodo,
    });

    render(<Todos />);

    expect(screen.getByText("todos.empty")).toBeInTheDocument();
  });

  it("should render all todos", () => {
    render(<Todos />);

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Learn React")).toBeInTheDocument();

    expect(screen.getByTestId("todo-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("todo-item-2")).toBeInTheDocument();
  });

  it("should render AddTodo", () => {
    render(<Todos />);

    expect(
      screen.getByRole("button", {
        name: "Add Todo",
      })
    ).toBeInTheDocument();
  });

  it("should pass addTodo to AddTodo", async () => {
    render(<Todos />);

    const addButton = screen.getByRole("button", {
      name: "Add Todo",
    });

    addButton.click();

    expect(mockAddTodo).toHaveBeenCalledWith("New todo");
  });
});
