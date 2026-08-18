import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReservationForm from "./ReservationForm";
import { sendReservationForm } from "../../services/reservation";

vi.mock("../../services/reservation", () => ({
  sendReservationForm: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ReservationForm", () => {
  const mockSend = vi.mocked(sendReservationForm);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function fillForm() {
    fireEvent.change(screen.getByLabelText("name"), {
      target: {
        value: "John",
      },
    });

    fireEvent.change(screen.getByLabelText("email"), {
      target: {
        value: "john@test.com",
      },
    });

    fireEvent.change(screen.getByLabelText("date"), {
      target: {
        value: "2026-07-28T18:00",
      },
    });

    fireEvent.change(screen.getByLabelText("message"), {
      target: {
        value: "Outdoors",
      },
    });
  }

  it("submits reservation successfully", async () => {
    const user = userEvent.setup();

    mockSend.mockResolvedValue(undefined);

    render(<ReservationForm />);

    fillForm();

    await user.click(
      screen.getByRole("button", {
        name: "about.reserve.send",
      })
    );

    await waitFor(() => {
      expect(mockSend).toHaveBeenCalledWith({
        name: "John",
        email: "john@test.com",
        date: "2026-07-28T18:00",
        message: "Outdoors",
      });
    });

    expect(screen.getByText("about.reserve.success")).toBeInTheDocument();
  });

  it("shows error when submit fails", async () => {
    const user = userEvent.setup();

    mockSend.mockRejectedValue(new Error("failed"));

    render(<ReservationForm />);

    fillForm();

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("about.reserve.error")).toBeInTheDocument();
    });
  });

  it("disables fields while submitting", async () => {
    const user = userEvent.setup();

    mockSend.mockImplementation(() => new Promise(() => {}));

    render(<ReservationForm />);

    fillForm();

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByLabelText("name")).toBeDisabled();
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
});
