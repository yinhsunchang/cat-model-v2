import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TodoItem from "./TodoItem";

import type { TodoStore } from "../../stores/todoStore";

const toggleTodo = vi.fn();
const editTodo = vi.fn();
const deleteTodo = vi.fn();

type MockStore = Pick<TodoStore, "toggleTodo" | "editTodo" | "deleteTodo">;

vi.mock("../../stores/todoStore", () => ({
  useTodoStore: (selector: (store: MockStore) => unknown) =>
    selector({
      toggleTodo,
      editTodo,
      deleteTodo,
    }),
}));

const todo = {
  id: 1,
  text: "Movie A",
  done: false,
};

describe("TodoItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders todo", () => {
    render(<TodoItem todo={todo} />);

    expect(screen.getByText("Movie A")).toBeInTheDocument();
  });

  it("toggles todo", async () => {
    const user = userEvent.setup();

    render(<TodoItem todo={todo} />);

    await user.click(screen.getByRole("checkbox"));

    expect(toggleTodo).toHaveBeenCalledWith(1);
  });

  it("deletes todo after confirmation", async () => {
    const user = userEvent.setup();

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<TodoItem todo={todo} />);

    await user.click(
      screen.getByRole("button", {
        name: /delete/i,
      })
    );

    expect(window.confirm).toHaveBeenCalled();
    expect(deleteTodo).toHaveBeenCalledWith(1);
  });

  it("does not delete todo when confirmation is cancelled", async () => {
    const user = userEvent.setup();

    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<TodoItem todo={todo} />);

    await user.click(
      screen.getByRole("button", {
        name: /delete/i,
      })
    );

    expect(deleteTodo).not.toHaveBeenCalled();
  });

  it("focuses edit input automatically", async () => {
    const user = userEvent.setup();

    render(<TodoItem todo={todo} />);

    await user.click(
      screen.getByRole("button", {
        name: /films.edit/i,
      })
    );

    const input = screen.getByDisplayValue("Movie A");

    expect(input).toHaveFocus();
  });

  it("edits todo", async () => {
    const user = userEvent.setup();

    render(<TodoItem todo={todo} />);

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    const input = screen.getByDisplayValue("Movie A");

    await user.clear(input);
    await user.type(input, "Movie B");

    await user.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(editTodo).toHaveBeenCalledWith(1, "Movie B");
  });

  it("saves edit when Enter is pressed", async () => {
    const user = userEvent.setup();

    render(<TodoItem todo={todo} />);

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    const input = screen.getByDisplayValue("Movie A");

    await user.clear(input);
    await user.type(input, "Movie B{Enter}");

    expect(editTodo).toHaveBeenCalledWith(1, "Movie B");
  });

  it("cancels edit when Escape is pressed", async () => {
    const user = userEvent.setup();

    render(<TodoItem todo={todo} />);

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    const input = screen.getByDisplayValue("Movie A");

    await user.clear(input);
    await user.type(input, "Movie B");
    await user.keyboard("{Escape}");

    expect(editTodo).not.toHaveBeenCalled();
    expect(screen.getByText("Movie A")).toBeInTheDocument();
  });

  it("does not save empty edit", async () => {
    const user = userEvent.setup();

    render(<TodoItem todo={todo} />);

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    const input = screen.getByDisplayValue("Movie A");

    await user.clear(input);

    await user.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(editTodo).not.toHaveBeenCalled();
  });
});
