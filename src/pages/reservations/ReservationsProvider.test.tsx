import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReservationsProvider } from "./ReservationsProvider";
import { ReservationsContext } from "./ReservationsContext";
import { reservationService } from "../../services/supaReservation";
import type { FormProps } from "../../types/reservations";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../services/supaReservation", () => ({
  reservationService: {
    getReservations: vi.fn(),
    deleteReservation: vi.fn(),
  },
}));

const mockReservations: FormProps[] = [
  {
    id: 1,
    name: "Mimi",
    email: "mimi@example.com",
    date: "2026-08-25",
    message: "Window seat please",
    created_at: "2026-08-20T10:00:00Z",
  },
  {
    id: 2,
    name: "John",
    email: "john@example.com",
    date: "2026-08-26",
    message: "Birthday dinner",
    created_at: "2026-08-20T11:00:00Z",
  },
];

function TestConsumer() {
  const context = useContext(ReservationsContext);

  if (!context) {
    throw new Error("TestConsumer must be used within ReservationsProvider");
  }

  const handleDelete = async () => {
    try {
      await context.deleteReservation(1);
    } catch {
      // The provider rethrows the error.
      // Catch it here to prevent an unhandled rejection in the test.
    }
  };

  return (
    <div>
      <span data-testid="loading">
        {context.loading ? "loading" : "loaded"}
      </span>

      <span data-testid="count">{context.reservations.length}</span>

      {context.reservations.map((reservation) => (
        <div key={reservation.id} data-testid={`reservation-${reservation.id}`}>
          {reservation.name}
        </div>
      ))}

      <button type="button" onClick={handleDelete}>
        Delete reservation 1
      </button>
    </div>
  );
}

function renderProvider() {
  return render(
    <ReservationsProvider>
      <TestConsumer />
    </ReservationsProvider>
  );
}

describe("ReservationsProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(window, "confirm").mockReturnValue(true);

    vi.mocked(reservationService.getReservations).mockResolvedValue(
      mockReservations
    );

    vi.mocked(reservationService.deleteReservation).mockResolvedValue(
      undefined
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should show loading initially", () => {
    vi.mocked(reservationService.getReservations).mockReturnValue(
      new Promise(() => {})
    );

    renderProvider();

    expect(screen.getByTestId("loading")).toHaveTextContent("loading");
  });

  it("should fetch reservations when mounted", async () => {
    renderProvider();

    await waitFor(() => {
      expect(reservationService.getReservations).toHaveBeenCalledTimes(1);
    });
  });

  it("should provide reservations after fetching", async () => {
    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("2");
    });

    expect(screen.getByTestId("reservation-1")).toHaveTextContent("Mimi");

    expect(screen.getByTestId("reservation-2")).toHaveTextContent("John");
  });

  it("should set loading to false after fetching", async () => {
    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("loaded");
    });
  });

  it("should handle fetch error", async () => {
    const error = new Error("Fetch failed");

    vi.mocked(reservationService.getReservations).mockRejectedValue(error);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("loaded");
    });

    expect(screen.getByTestId("count")).toHaveTextContent("0");

    expect(consoleError).toHaveBeenCalledWith(
      "Failed to fetch reservations:",
      error
    );
  });

  it("should delete reservation after confirmation", async () => {
    const user = userEvent.setup();

    vi.mocked(window.confirm).mockReturnValue(true);

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("2");
    });

    await user.click(
      screen.getByRole("button", {
        name: "Delete reservation 1",
      })
    );

    expect(window.confirm).toHaveBeenCalledWith("confirm.delete");

    expect(reservationService.deleteReservation).toHaveBeenCalledWith(1);

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    expect(screen.queryByTestId("reservation-1")).not.toBeInTheDocument();

    expect(screen.getByTestId("reservation-2")).toBeInTheDocument();
  });

  it("should not delete reservation when confirmation is cancelled", async () => {
    const user = userEvent.setup();

    vi.mocked(window.confirm).mockReturnValue(false);

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("2");
    });

    await user.click(
      screen.getByRole("button", {
        name: "Delete reservation 1",
      })
    );

    expect(window.confirm).toHaveBeenCalledWith("confirm.delete");

    expect(reservationService.deleteReservation).not.toHaveBeenCalled();

    expect(screen.getByTestId("count")).toHaveTextContent("2");

    expect(screen.getByTestId("reservation-1")).toBeInTheDocument();

    expect(screen.getByTestId("reservation-2")).toBeInTheDocument();
  });

  it("should handle delete error", async () => {
    const user = userEvent.setup();

    const error = new Error("Delete failed");

    vi.mocked(reservationService.deleteReservation).mockRejectedValue(error);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("2");
    });

    await user.click(
      screen.getByRole("button", {
        name: "Delete reservation 1",
      })
    );

    await waitFor(() => {
      expect(reservationService.deleteReservation).toHaveBeenCalledWith(1);
    });

    expect(consoleError).toHaveBeenCalledWith(
      "Failed to delete reservation:",
      error
    );

    expect(screen.getByTestId("count")).toHaveTextContent("2");

    expect(screen.getByTestId("reservation-1")).toBeInTheDocument();
  });
});
