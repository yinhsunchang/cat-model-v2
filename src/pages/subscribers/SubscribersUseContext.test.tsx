import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useSubscribers } from "./useSubscribers";
import Subscribers from "./Subscribers";

vi.mock("./useSubscribers", () => ({
  useSubscribers: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockAddSubscriber = vi.fn();
const mockDeleteSubscriber = vi.fn();
const mockEditSubscriber = vi.fn();

const mockSubscribers = [
  {
    id: 1,
    email: "mimi@example.com",
  },
  {
    id: 2,
    email: "john@example.com",
  },
];

describe("Subscribers", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSubscribers).mockReturnValue({
      subscribers: mockSubscribers,
      addSubscriber: mockAddSubscriber,
      deleteSubscriber: mockDeleteSubscriber,
      editSubscriber: mockEditSubscriber,
    });

    mockAddSubscriber.mockResolvedValue(undefined);
    mockDeleteSubscriber.mockResolvedValue(undefined);
    mockEditSubscriber.mockResolvedValue(undefined);

    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "prompt").mockReturnValue("updated@example.com");
  });

  describe("rendering", () => {
    it("should render subscribers", () => {
      render(<Subscribers />);

      expect(screen.getByText("mimi@example.com")).toBeInTheDocument();

      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("should render empty message when there are no subscribers", () => {
      vi.mocked(useSubscribers).mockReturnValue({
        subscribers: [],
        addSubscriber: mockAddSubscriber,
        deleteSubscriber: mockDeleteSubscriber,
        editSubscriber: mockEditSubscriber,
      });

      render(<Subscribers />);

      expect(screen.getByText("subscribers.empty")).toBeInTheDocument();
    });

    it("should render the input and add button", () => {
      render(<Subscribers />);

      expect(
        screen.getByPlaceholderText("subscribers.placeholder")
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: /subscribers.add/i,
        })
      ).toBeInTheDocument();
    });
  });

  describe("add subscriber", () => {
    it("should add a subscriber", async () => {
      render(<Subscribers />);

      const input = screen.getByPlaceholderText("subscribers.placeholder");

      fireEvent.change(input, {
        target: {
          value: "new@example.com",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /subscribers.add/i,
        })
      );

      await waitFor(() => {
        expect(mockAddSubscriber).toHaveBeenCalledWith("new@example.com");
      });
    });

    it("should trim whitespace before adding", async () => {
      render(<Subscribers />);

      const input = screen.getByPlaceholderText("subscribers.placeholder");

      fireEvent.change(input, {
        target: {
          value: "  new@example.com  ",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /subscribers.add/i,
        })
      );

      await waitFor(() => {
        expect(mockAddSubscriber).toHaveBeenCalledWith("new@example.com");
      });
    });

    it("should not add an empty subscriber", () => {
      render(<Subscribers />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /subscribers.add/i,
        })
      );

      expect(mockAddSubscriber).not.toHaveBeenCalled();
    });

    it("should not add a whitespace-only subscriber", () => {
      render(<Subscribers />);

      const input = screen.getByPlaceholderText("subscribers.placeholder");

      fireEvent.change(input, {
        target: {
          value: "   ",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /subscribers.add/i,
        })
      );

      expect(mockAddSubscriber).not.toHaveBeenCalled();
    });

    it("should add subscriber when pressing Enter", async () => {
      render(<Subscribers />);

      const input = screen.getByPlaceholderText("subscribers.placeholder");

      fireEvent.change(input, {
        target: {
          value: "enter@example.com",
        },
      });

      fireEvent.keyDown(input, {
        key: "Enter",
      });

      await waitFor(() => {
        expect(mockAddSubscriber).toHaveBeenCalledWith("enter@example.com");
      });
    });

    it("should clear the input after successful add", async () => {
      render(<Subscribers />);

      const input = screen.getByPlaceholderText(
        "subscribers.placeholder"
      ) as HTMLInputElement;

      fireEvent.change(input, {
        target: {
          value: "new@example.com",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /subscribers.add/i,
        })
      );

      await waitFor(() => {
        expect(input.value).toBe("");
      });
    });

    it("should show an error when adding fails", async () => {
      const error = new Error("Add failed");

      mockAddSubscriber.mockRejectedValueOnce(error);

      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<Subscribers />);

      const input = screen.getByPlaceholderText("subscribers.placeholder");

      fireEvent.change(input, {
        target: {
          value: "new@example.com",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /subscribers.add/i,
        })
      );

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "subscribers.addFailed"
      );

      expect(consoleError).toHaveBeenCalledWith(error);

      consoleError.mockRestore();
    });
  });

  describe("delete subscriber", () => {
    it("should delete a subscriber", async () => {
      render(<Subscribers />);

      const deleteButtons = screen.getAllByRole("button", {
        name: /subscribers.delete/i,
      });

      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockDeleteSubscriber).toHaveBeenCalledWith(1);
      });
    });

    it("should delete the correct subscriber", async () => {
      render(<Subscribers />);

      const deleteButtons = screen.getAllByRole("button", {
        name: /subscribers.delete/i,
      });

      fireEvent.click(deleteButtons[1]);

      await waitFor(() => {
        expect(mockDeleteSubscriber).toHaveBeenCalledWith(2);
      });
    });

    it("should show an alert when delete fails", async () => {
      const error = new Error("Delete failed");

      mockDeleteSubscriber.mockRejectedValueOnce(error);

      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<Subscribers />);

      const deleteButtons = screen.getAllByRole("button", {
        name: /subscribers.delete/i,
      });

      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Delete failed");
      });

      expect(consoleError).toHaveBeenCalledWith(error);

      consoleError.mockRestore();
    });
  });

  describe("edit subscriber", () => {
    it("should edit a subscriber", async () => {
      render(<Subscribers />);

      const editButtons = screen.getAllByRole("button", {
        name: /subscribers.edit/i,
      });

      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(mockEditSubscriber).toHaveBeenCalledWith(
          1,
          "updated@example.com"
        );
      });
    });

    it("should edit the correct subscriber", async () => {
      vi.spyOn(window, "prompt").mockReturnValue("newjohn@example.com");

      render(<Subscribers />);

      const editButtons = screen.getAllByRole("button", {
        name: /subscribers.edit/i,
      });

      fireEvent.click(editButtons[1]);

      await waitFor(() => {
        expect(mockEditSubscriber).toHaveBeenCalledWith(
          2,
          "newjohn@example.com"
        );
      });
    });

    it("should not edit when prompt is cancelled", () => {
      vi.spyOn(window, "prompt").mockReturnValue(null);

      render(<Subscribers />);

      const editButtons = screen.getAllByRole("button", {
        name: /subscribers.edit/i,
      });

      fireEvent.click(editButtons[0]);

      expect(mockEditSubscriber).not.toHaveBeenCalled();
    });

    it("should not edit when prompt is empty", () => {
      vi.spyOn(window, "prompt").mockReturnValue("");

      render(<Subscribers />);

      const editButtons = screen.getAllByRole("button", {
        name: /subscribers.edit/i,
      });

      fireEvent.click(editButtons[0]);

      expect(mockEditSubscriber).not.toHaveBeenCalled();
    });

    it("should not edit when prompt contains only whitespace", () => {
      vi.spyOn(window, "prompt").mockReturnValue("   ");

      render(<Subscribers />);

      const editButtons = screen.getAllByRole("button", {
        name: /subscribers.edit/i,
      });

      fireEvent.click(editButtons[0]);

      expect(mockEditSubscriber).not.toHaveBeenCalled();
    });

    it("should show an alert when edit fails", async () => {
      const error = new Error("Edit failed");

      mockEditSubscriber.mockRejectedValueOnce(error);

      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<Subscribers />);

      const editButtons = screen.getAllByRole("button", {
        name: /subscribers.edit/i,
      });

      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Edit failed");
      });

      expect(consoleError).toHaveBeenCalledWith(error);

      consoleError.mockRestore();
    });
  });
});
