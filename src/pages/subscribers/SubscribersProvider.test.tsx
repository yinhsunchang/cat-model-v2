import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useContext } from "react";
import { SubscribersProvider } from "./SubscribersProvider";
import { SubscribersContext } from "./SubscribersContext";
import { subscriberService } from "../../services/supaSubscriber";
import type { Subscriber } from "../../types/subscriber";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../services/supaSubscriber", () => ({
  subscriberService: {
    getSubscribers: vi.fn(),
    addSubscriber: vi.fn(),
    updateSubscriber: vi.fn(),
    deleteSubscriber: vi.fn(),
  },
}));

const mockSubscribers: Subscriber[] = [
  {
    id: 1,
    email: "mimi@example.com",
  },
  {
    id: 2,
    email: "john@example.com",
  },
];

function TestConsumer() {
  const context = useContext(SubscribersContext);

  if (!context) {
    throw new Error("TestConsumer must be used within SubscribersProvider");
  }

  const { subscribers, addSubscriber, editSubscriber, deleteSubscriber } =
    context;

  const handleAdd = async () => {
    try {
      await addSubscriber("new@example.com");
    } catch {
      // Prevent unhandled promise rejection.
    }
  };

  const handleEdit = async () => {
    try {
      await editSubscriber(1, "updated@example.com");
    } catch {
      // Prevent unhandled promise rejection.
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubscriber(1);
    } catch {
      // Prevent unhandled promise rejection.
    }
  };

  return (
    <div>
      <p data-testid="count">{subscribers.length}</p>

      {subscribers.map((subscriber) => (
        <p key={subscriber.id}>{subscriber.email}</p>
      ))}

      <button type="button" onClick={handleAdd}>
        Add
      </button>

      <button type="button" onClick={handleEdit}>
        Edit
      </button>

      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}

describe("SubscribersProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(subscriberService.getSubscribers).mockResolvedValue(
      mockSubscribers
    );

    vi.mocked(subscriberService.addSubscriber).mockResolvedValue({
      id: 3,
      email: "new@example.com",
    });

    vi.mocked(subscriberService.updateSubscriber).mockResolvedValue({
      id: 1,
      email: "updated@example.com",
    });

    vi.mocked(subscriberService.deleteSubscriber).mockResolvedValue(undefined);

    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("should add a subscriber", async () => {
    render(
      <SubscribersProvider>
        <TestConsumer />
      </SubscribersProvider>
    );

    await screen.findByText("mimi@example.com");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add",
      })
    );

    await waitFor(() => {
      expect(subscriberService.addSubscriber).toHaveBeenCalledWith(
        "new@example.com"
      );
    });

    expect(screen.getByText("new@example.com")).toBeInTheDocument();

    expect(screen.getByTestId("count")).toHaveTextContent("3");
  });

  it("should edit a subscriber", async () => {
    render(
      <SubscribersProvider>
        <TestConsumer />
      </SubscribersProvider>
    );

    await screen.findByText("mimi@example.com");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    await waitFor(() => {
      expect(subscriberService.updateSubscriber).toHaveBeenCalledWith(1, {
        email: "updated@example.com",
      });
    });

    expect(screen.getByText("updated@example.com")).toBeInTheDocument();

    expect(screen.queryByText("mimi@example.com")).not.toBeInTheDocument();

    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });

  it("should delete a subscriber", async () => {
    render(
      <SubscribersProvider>
        <TestConsumer />
      </SubscribersProvider>
    );

    await screen.findByText("mimi@example.com");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {
      expect(subscriberService.deleteSubscriber).toHaveBeenCalledWith(1);
    });

    expect(screen.queryByText("mimi@example.com")).not.toBeInTheDocument();

    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("should not delete when confirmation is cancelled", async () => {
    vi.mocked(window.confirm).mockReturnValue(false);

    render(
      <SubscribersProvider>
        <TestConsumer />
      </SubscribersProvider>
    );

    await screen.findByText("mimi@example.com");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(subscriberService.deleteSubscriber).not.toHaveBeenCalled();

    expect(screen.getByText("mimi@example.com")).toBeInTheDocument();

    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });
});
