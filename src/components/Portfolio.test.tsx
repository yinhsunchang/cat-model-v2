import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Portfolio from "./Portfolio";
import photos from "../services/photos";

// mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// mock Reveal
vi.mock("./Reveal.tsx", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// mock ModalPhoto
vi.mock("./ModalPhoto.tsx", () => ({
  default: ({ index, onClose }: { index: number; onClose: () => void }) => (
    <div data-testid="modal">
      Modal index: {index}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("Portfolio", () => {
  it("renders title", () => {
    render(<Portfolio />);

    expect(screen.getByText("photo.title")).toBeInTheDocument();
  });

  it("renders all photos", () => {
    render(<Portfolio />);

    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(photos.length);
  });

  it("opens modal when photo clicked", async () => {
    const user = userEvent.setup();

    render(<Portfolio />);

    const images = screen.getAllByRole("img");

    await user.click(images[0]);
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Modal index: 0")).toBeInTheDocument();
  });

  it("closes modal", async () => {
    const user = userEvent.setup();

    render(<Portfolio />);

    await user.click(screen.getAllByRole("img")[0]);
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    await user.click(screen.getByText("Close"));
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
});
