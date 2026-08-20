import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useContext } from "react";

import { TodosProvider } from "./TodosProvider";
import { TodosContext } from "./TodosContext";
import { TodosAPI } from "./TodosAPI";

import type { Todo } from "../../types/todo";

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

function TestConsumer() {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error("TestConsumer must be used within TodosProvider");
  }

  const { todos, loading, addTodo, toggleTodo, deleteTodo, editTodo } = context;

  const handleAdd = async () => {
    try {
      await addTodo("New todo");
    } catch {
      // Prevent unhandled promise rejection in the test.
    }
  };

  const handleToggle = async () => {
    try {
      await toggleTodo(1);
    } catch {
      // Prevent unhandled promise rejection in the test.
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(1);
    } catch {
      // Prevent unhandled promise rejection in the test.
    }
  };

  const handleEdit = async () => {
    try {
      await editTodo(1, "Updated todo");
    } catch {
      // Prevent unhandled promise rejection in the test.
    }
  };

  return (
    <div>
      <p data-testid="loading">{loading ? "true" : "false"}</p>

      <p data-testid="count">{todos.length}</p>

      {todos.map((todo) => (
        <p key={todo.id}>
          {todo.text} - {todo.done ? "done" : "not done"}
        </p>
      ))}

      <button type="button" onClick={handleAdd}>
        Add
      </button>

      <button type="button" onClick={handleToggle}>
        Toggle
      </button>

      <button type="button" onClick={handleDelete}>
        Delete
      </button>

      <button type="button" onClick={handleEdit}>
        Edit
      </button>
    </div>
  );
}

describe("TodosProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(TodosAPI.getTodos).mockResolvedValue(mockTodos);

    vi.mocked(TodosAPI.create).mockResolvedValue({
      id: 3,
      text: "New todo",
      done: false,
    });

    vi.mocked(TodosAPI.update).mockResolvedValue({
      id: 1,
      text: "Updated todo",
      done: true,
    });

    vi.mocked(TodosAPI.delete).mockResolvedValue(undefined);

    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --------------------------------------------------
  // Initial loading
  // --------------------------------------------------

  it("should load todos when the provider mounts", async () => {
    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    expect(TodosAPI.getTodos).toHaveBeenCalledTimes(1);

    expect(await screen.findByText("Buy milk - not done")).toBeInTheDocument();

    expect(screen.getByText("Learn React - done")).toBeInTheDocument();

    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });

  it("should set loading to false after todos are loaded", async () => {
    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("true");

    await screen.findByText("Buy milk - not done");

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  it("should add a todo", async () => {
    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    await screen.findByText("Buy milk - not done");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add",
      })
    );

    await waitFor(() => {
      expect(TodosAPI.create).toHaveBeenCalledWith("New todo");
    });

    expect(screen.getByText("New todo - not done")).toBeInTheDocument();

    expect(screen.getByTestId("count")).toHaveTextContent("3");
  });

  // --------------------------------------------------
  // Toggle
  // --------------------------------------------------

  it("should toggle a todo", async () => {
    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    await screen.findByText("Buy milk - not done");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Toggle",
      })
    );

    await waitFor(() => {
      expect(TodosAPI.update).toHaveBeenCalledWith(1, {
        done: true,
      });
    });

    expect(screen.getByText("Updated todo - done")).toBeInTheDocument();

    expect(screen.queryByText("Buy milk - not done")).not.toBeInTheDocument();
  });

  // --------------------------------------------------
  // Toggle non-existing todo
  // --------------------------------------------------

  it("should throw when toggling a todo that does not exist", async () => {
    function InvalidToggleConsumer() {
      const context = useContext(TodosContext);

      if (!context) {
        throw new Error(
          "InvalidToggleConsumer must be used within TodosProvider"
        );
      }

      const handleToggle = async () => {
        try {
          await context.toggleTodo(999);
        } catch {
          // Prevent unhandled promise rejection.
        }
      };

      return (
        <button type="button" onClick={handleToggle}>
          Toggle missing
        </button>
      );
    }

    render(
      <TodosProvider>
        <InvalidToggleConsumer />
      </TodosProvider>
    );

    await waitFor(() => {
      expect(TodosAPI.getTodos).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Toggle missing",
      })
    );

    await waitFor(() => {
      expect(TodosAPI.update).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  it("should delete a todo after confirmation", async () => {
    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    await screen.findByText("Buy milk - not done");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {
      expect(TodosAPI.delete).toHaveBeenCalledWith(1);
    });

    expect(screen.queryByText("Buy milk - not done")).not.toBeInTheDocument();

    expect(screen.getByTestId("count")).toHaveTextContent("1");

    expect(window.confirm).toHaveBeenCalledWith("confirm.delete");
  });

  it("should not delete a todo when confirmation is cancelled", async () => {
    vi.mocked(window.confirm).mockReturnValue(false);

    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    await screen.findByText("Buy milk - not done");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith("confirm.delete");
    });

    expect(TodosAPI.delete).not.toHaveBeenCalled();

    expect(screen.getByText("Buy milk - not done")).toBeInTheDocument();

    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  it("should edit a todo", async () => {
    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    await screen.findByText("Buy milk - not done");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    await waitFor(() => {
      expect(TodosAPI.update).toHaveBeenCalledWith(1, {
        text: "Updated todo",
      });
    });

    expect(screen.getByText("Updated todo - done")).toBeInTheDocument();

    expect(screen.queryByText("Buy milk - not done")).not.toBeInTheDocument();
  });

  // --------------------------------------------------
  // API errors
  // --------------------------------------------------

  it("should handle getTodos failure", async () => {
    const error = new Error("Failed to fetch todos");

    vi.mocked(TodosAPI.getTodos).mockRejectedValue(error);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    await waitFor(() => {
      expect(TodosAPI.getTodos).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Failed to fetch Todos:",
        error
      );
    });

    expect(screen.getByTestId("loading")).toHaveTextContent("false");

    expect(screen.getByTestId("count")).toHaveTextContent("0");

    consoleError.mockRestore();
  });

  it("should rethrow when addTodo fails", async () => {
    const error = new Error("Add failed");

    vi.mocked(TodosAPI.create).mockRejectedValue(error);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    await screen.findByText("Buy milk - not done");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add",
      })
    );

    await waitFor(() => {
      expect(TodosAPI.create).toHaveBeenCalledWith("New todo");
    });

    expect(screen.getByTestId("count")).toHaveTextContent("2");

    expect(screen.queryByText("New todo - not done")).not.toBeInTheDocument();

    expect(consoleError).toHaveBeenCalledWith("Failed to add todo:", error);

    consoleError.mockRestore();
  });

  it("should rethrow when toggleTodo fails", async () => {
    const error = new Error("Toggle failed");

    vi.mocked(TodosAPI.update).mockRejectedValue(error);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    await screen.findByText("Buy milk - not done");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Toggle",
      })
    );

    await waitFor(() => {
      expect(TodosAPI.update).toHaveBeenCalledWith(1, {
        done: true,
      });
    });

    expect(screen.getByTestId("count")).toHaveTextContent("2");

    expect(screen.getByText("Buy milk - not done")).toBeInTheDocument();

    expect(consoleError).toHaveBeenCalledWith("Failed to toggle todo:", error);

    consoleError.mockRestore();
  });

  it("should rethrow when deleteTodo fails", async () => {
    const error = new Error("Delete failed");

    vi.mocked(TodosAPI.delete).mockRejectedValue(error);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    await screen.findByText("Buy milk - not done");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {
      expect(TodosAPI.delete).toHaveBeenCalledWith(1);
    });

    expect(screen.getByTestId("count")).toHaveTextContent("2");

    expect(screen.getByText("Buy milk - not done")).toBeInTheDocument();

    expect(consoleError).toHaveBeenCalledWith("Failed to delete todo:", error);

    consoleError.mockRestore();
  });

  it("should rethrow when editTodo fails", async () => {
    const error = new Error("Edit failed");

    vi.mocked(TodosAPI.update).mockRejectedValue(error);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TodosProvider>
        <TestConsumer />
      </TodosProvider>
    );

    await screen.findByText("Buy milk - not done");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    await waitFor(() => {
      expect(TodosAPI.update).toHaveBeenCalledWith(1, {
        text: "Updated todo",
      });
    });

    expect(screen.getByTestId("count")).toHaveTextContent("2");

    expect(screen.getByText("Buy milk - not done")).toBeInTheDocument();

    expect(consoleError).toHaveBeenCalledWith("Failed to edit todo:", error);

    consoleError.mockRestore();
  });
});
