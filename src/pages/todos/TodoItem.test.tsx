import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "./TodoItem";
import type { Todo } from "../../types/todo";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("TodoItem", () => {
  const todo: Todo = {
    id: 1,
    text: "Buy milk",
    done: false,
  };

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderTodo = () =>
    render(
      <TodoItem
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

  it("renders todo text", () => {
    renderTodo();

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("renders unchecked checkbox", () => {
    renderTodo();

    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("renders checked checkbox for completed todo", () => {
    render(
      <TodoItem
        todo={{
          ...todo,
          done: true,
        }}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("toggles todo", async () => {
    const user = userEvent.setup();

    renderTodo();

    await user.click(screen.getByRole("checkbox"));

    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  it("enters edit mode", async () => {
    const user = userEvent.setup();

    renderTodo();

    await user.click(
      screen.getByRole("button", {
        name: /todos.edit/i,
      })
    );

    expect(screen.getByDisplayValue("Buy milk")).toBeInTheDocument();
  });

  it("focuses edit input automatically", async () => {
    const user = userEvent.setup();

    renderTodo();

    await user.click(
      screen.getByRole("button", {
        name: /todos.edit/i,
      })
    );

    expect(screen.getByDisplayValue("Buy milk")).toHaveFocus();
  });

  it("saves edited todo", async () => {
    const user = userEvent.setup();

    mockOnEdit.mockResolvedValue(undefined);

    renderTodo();

    await user.click(
      screen.getByRole("button", {
        name: /todos.edit/i,
      })
    );

    const input = screen.getByDisplayValue("Buy milk");

    await user.clear(input);
    await user.type(input, "Buy oat milk");

    await user.click(
      screen.getByRole("button", {
        name: /todos.save/i,
      })
    );

    expect(mockOnEdit).toHaveBeenCalledWith(1, "Buy oat milk");
  });

  it("trims edited text", async () => {
    const user = userEvent.setup();

    mockOnEdit.mockResolvedValue(undefined);

    renderTodo();

    await user.click(
      screen.getByRole("button", {
        name: /todos.edit/i,
      })
    );

    const input = screen.getByDisplayValue("Buy milk");

    await user.clear(input);
    await user.type(input, "  Buy oat milk  ");

    await user.click(
      screen.getByRole("button", {
        name: /todos.save/i,
      })
    );

    expect(mockOnEdit).toHaveBeenCalledWith(1, "Buy oat milk");
  });

  it("saves when Enter is pressed", async () => {
    const user = userEvent.setup();

    mockOnEdit.mockResolvedValue(undefined);

    renderTodo();

    await user.click(
      screen.getByRole("button", {
        name: /todos.edit/i,
      })
    );

    const input = screen.getByDisplayValue("Buy milk");

    await user.clear(input);
    await user.type(input, "Buy bread");

    await user.keyboard("{Enter}");

    expect(mockOnEdit).toHaveBeenCalledWith(1, "Buy bread");
  });

  it("cancels edit when Escape is pressed", async () => {
    const user = userEvent.setup();

    renderTodo();

    await user.click(
      screen.getByRole("button", {
        name: /todos.edit/i,
      })
    );

    const input = screen.getByDisplayValue("Buy milk");

    await user.clear(input);
    await user.type(input, "Something else");

    await user.keyboard("{Escape}");

    expect(screen.getByText("Buy milk")).toBeInTheDocument();

    expect(
      screen.queryByDisplayValue("Something else")
    ).not.toBeInTheDocument();

    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it("does not save empty text", async () => {
    const user = userEvent.setup();

    renderTodo();

    await user.click(
      screen.getByRole("button", {
        name: /todos.edit/i,
      })
    );

    const input = screen.getByDisplayValue("Buy milk");

    await user.clear(input);

    expect(
      screen.getByRole("button", {
        name: /todos.save/i,
      })
    ).toBeDisabled();

    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it("deletes todo", async () => {
    const user = userEvent.setup();

    mockOnDelete.mockResolvedValue(undefined);

    renderTodo();

    await user.click(
      screen.getByRole("button", {
        name: /todos.delete/i,
      })
    );

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it("shows error when edit fails", async () => {
    const user = userEvent.setup();

    mockOnEdit.mockRejectedValue(new Error("Network error"));

    renderTodo();

    await user.click(
      screen.getByRole("button", {
        name: /todos.edit/i,
      })
    );

    const input = screen.getByDisplayValue("Buy milk");

    await user.clear(input);
    await user.type(input, "New text");

    await user.click(
      screen.getByRole("button", {
        name: /todos.save/i,
      })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "todos.editFailed"
    );
  });

  it("shows error when delete fails", async () => {
    const user = userEvent.setup();

    mockOnDelete.mockRejectedValue(new Error("Network error"));

    renderTodo();

    await user.click(
      screen.getByRole("button", {
        name: /todos.delete/i,
      })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "todos.deleteFailed"
    );
  });
});
