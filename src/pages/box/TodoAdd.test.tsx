import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodo from "./TodoAdd";

const { addTodo } = vi.hoisted(() => ({
  addTodo: vi.fn(),
}));

vi.mock("../../stores/todoStore", () => ({
  useTodoStore: (selector: (store: { addTodo: typeof addTodo }) => unknown) =>
    selector({
      addTodo,
    }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "films.placeholder": "Add a movie...",
        "films.add": "Add",
      };

      return translations[key] ?? key;
    },
  }),
}));

describe("AddTodo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds todo", async () => {
    const user = userEvent.setup();

    render(<AddTodo />);

    const input = screen.getByPlaceholderText("Add a movie...");
    await user.type(input, "Movie");

    await user.click(
      screen.getByRole("button", {
        name: /add/i,
      })
    );

    expect(addTodo).toHaveBeenCalledWith("Movie");
  });

  it("clears input after add", async () => {
    const user = userEvent.setup();

    render(<AddTodo />);

    const input = screen.getByPlaceholderText("Add a movie...");

    await user.type(input, "Movie");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(input).toHaveValue("");
  });

  it("adds when Enter is pressed", async () => {
    const user = userEvent.setup();

    render(<AddTodo />);

    const input = screen.getByPlaceholderText("Add a movie...");

    await user.type(input, "Movie{Enter}");

    expect(addTodo).toHaveBeenCalledWith("Movie");
  });

  it("clears input on Escape", async () => {
    const user = userEvent.setup();

    render(<AddTodo />);

    const input = screen.getByPlaceholderText("Add a movie...");

    await user.type(input, "Movie");
    await user.keyboard("{Escape}");

    expect(input).toHaveValue("");
  });
});
