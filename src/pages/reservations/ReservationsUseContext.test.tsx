import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Reservations from "./Reservations";
import { useReservations } from "./useReservations";
import type { FormProps } from "../../types/reservations";

vi.mock("./useReservations", () => ({
  useReservations: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        loading: "Loading...",
        "reservations.empty": "No reservations",
        "reservations.delete": "Delete",
        "reservations.deleting": "Deleting...",
        "reservations.deleteFailed": "Failed to delete reservation",
      };

      return translations[key] ?? key;
    },
  }),
}));

const mockReservations: FormProps[] = [
  {
    id: 1,
    name: "Mimi",
    email: "mimi@example.com",
    date: "2026-08-25T18:00:00Z",
    message: "Window seat please",
    created_at: "2026-08-20T10:00:00Z",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    date: "2026-08-26T19:00:00Z",
    message: "Birthday dinner",
    created_at: "2026-08-20T11:00:00Z",
  },
];

const mockDeleteReservation = vi.fn();

function mockUseReservations(
  overrides: Partial<ReturnType<typeof useReservations>> = {}
) {
  vi.mocked(useReservations).mockReturnValue({
    reservations: mockReservations,
    loading: false,
    deleteReservation: mockDeleteReservation,
    ...overrides,
  });
}

describe("Reservations", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockDeleteReservation.mockResolvedValue(undefined);

    mockUseReservations();
  });

  it("should show loading state", () => {
    mockUseReservations({
      reservations: [],
      loading: true,
    });

    render(<Reservations />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should show empty message when there are no reservations", () => {
    mockUseReservations({
      reservations: [],
      loading: false,
    });

    render(<Reservations />);

    expect(screen.getByText("No reservations")).toBeInTheDocument();
  });

  it("should render all reservations", () => {
    render(<Reservations />);

    expect(screen.getByText("Name: Mimi")).toBeInTheDocument();

    expect(screen.getByText("Email: mimi@example.com")).toBeInTheDocument();

    expect(screen.getByText("Message: Window seat please")).toBeInTheDocument();

    expect(screen.getByText("Name: John Doe")).toBeInTheDocument();

    expect(screen.getByText("Email: john@example.com")).toBeInTheDocument();

    expect(screen.getByText("Message: Birthday dinner")).toBeInTheDocument();
  });

  it("should format reservation dates", () => {
    render(<Reservations />);

    const reservationDate = new Date("2026-08-25T18:00:00Z");

    const expectedReservationDate = reservationDate.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    expect(
      screen.getByText(`Date: ${expectedReservationDate}`)
    ).toBeInTheDocument();

    const createdAt = new Date("2026-08-20T10:00:00Z");

    const expectedCreatedAt = createdAt.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    expect(screen.getByText(expectedCreatedAt)).toBeInTheDocument();
  });

  it("should delete a reservation when delete button is clicked", async () => {
    const user = userEvent.setup();

    render(<Reservations />);

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete/i,
    });

    expect(deleteButtons).toHaveLength(2);

    await user.click(deleteButtons[0]);

    expect(mockDeleteReservation).toHaveBeenCalledTimes(1);

    expect(mockDeleteReservation).toHaveBeenCalledWith(1);
  });

  it("should show deleting state while deleting", async () => {
    const user = userEvent.setup();

    let resolveDelete!: () => void;

    mockDeleteReservation.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveDelete = resolve;
      })
    );

    render(<Reservations />);

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete/i,
    });

    await user.click(deleteButtons[0]);

    const deletingButton = screen.getByRole("button", {
      name: "Deleting...",
    });

    expect(deletingButton).toBeDisabled();

    const otherDeleteButton = screen.getByRole("button", {
      name: "Delete",
    });

    expect(otherDeleteButton).not.toBeDisabled();

    resolveDelete();

    await waitFor(() => {
      expect(
        screen.getAllByRole("button", {
          name: "Delete",
        })
      ).toHaveLength(2);
    });
  });

  it("should show an error when deletion fails", async () => {
    const user = userEvent.setup();

    const error = new Error("Delete failed");

    mockDeleteReservation.mockRejectedValue(error);

    render(<Reservations />);

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete/i,
    });

    await user.click(deleteButtons[0]);

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent("Failed to delete reservation");

    expect(mockDeleteReservation).toHaveBeenCalledWith(1);
  });

  it("should clear the previous error before trying again", async () => {
    const user = userEvent.setup();

    mockDeleteReservation
      .mockRejectedValueOnce(new Error("Delete failed"))
      .mockResolvedValueOnce(undefined);

    render(<Reservations />);

    // First deletion fails.
    let deleteButtons = screen.getAllByRole("button", {
      name: /delete/i,
    });

    await user.click(deleteButtons[0]);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to delete reservation"
    );

    // Try deleting again.
    deleteButtons = screen.getAllByRole("button", {
      name: /delete/i,
    });

    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
