import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Reservation from "./Reservation";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./ReservationForm", () => ({
  default: () => <div>Mock ReservationForm</div>,
}));

describe("Reservation", () => {
  it("opens the modal when reserve button is clicked", async () => {
    const user = userEvent.setup();

    render(<Reservation />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "about.price.reserve",
      })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("about.reserve.title")).toBeInTheDocument();
    expect(screen.getByText("Mock ReservationForm")).toBeInTheDocument();
  });

  it("closes the modal when close button is clicked", async () => {
    const user = userEvent.setup();

    render(<Reservation />);

    await user.click(
      screen.getByRole("button", {
        name: "about.price.reserve",
      })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Close reservation",
      })
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
