import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodo from "./TodoAdd";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("AddTodo", () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input and add button", () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    expect(
      screen.getByPlaceholderText("todos.placeholder")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /todos.add/i,
      })
    ).toBeInTheDocument();
  });

  it("disables add button when input is empty", () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    expect(
      screen.getByRole("button", {
        name: /todos.add/i,
      })
    ).toBeDisabled();
  });

  it("adds a todo", async () => {
    const user = userEvent.setup();

    mockOnAdd.mockResolvedValue(undefined);

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("todos.placeholder");

    await user.type(input, "Buy milk");

    await user.click(
      screen.getByRole("button", {
        name: /todos.add/i,
      })
    );

    expect(mockOnAdd).toHaveBeenCalledWith("Buy milk");
  });

  it("trims whitespace before adding", async () => {
    const user = userEvent.setup();

    mockOnAdd.mockResolvedValue(undefined);

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("todos.placeholder");

    await user.type(input, "   Buy milk   ");

    await user.click(
      screen.getByRole("button", {
        name: /todos.add/i,
      })
    );

    expect(mockOnAdd).toHaveBeenCalledWith("Buy milk");
  });

  it("adds a todo when Enter is pressed", async () => {
    const user = userEvent.setup();

    mockOnAdd.mockResolvedValue(undefined);

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("todos.placeholder");

    await user.type(input, "Buy milk");

    await user.keyboard("{Enter}");

    expect(mockOnAdd).toHaveBeenCalledWith("Buy milk");
  });

  it("does not add whitespace-only input", async () => {
    const user = userEvent.setup();

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("todos.placeholder");

    await user.type(input, "   ");

    expect(
      screen.getByRole("button", {
        name: /todos.add/i,
      })
    ).toBeDisabled();

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it("clears input after successful add", async () => {
    const user = userEvent.setup();

    mockOnAdd.mockResolvedValue(undefined);

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("todos.placeholder");

    await user.type(input, "Buy milk");

    await user.click(
      screen.getByRole("button", {
        name: /todos.add/i,
      })
    );

    expect(input).toHaveValue("");
  });

  it("shows error when adding fails", async () => {
    const user = userEvent.setup();

    mockOnAdd.mockRejectedValue(new Error("Network error"));

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("todos.placeholder");

    await user.type(input, "Buy milk");

    await user.click(
      screen.getByRole("button", {
        name: /todos.add/i,
      })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "todos.addFailed"
    );
  });
});
