import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalPhoto from "../components/ModalPhoto";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

beforeEach(() => {
  Element.prototype.scrollTo = vi.fn();
});

const photos = [
  {
    id: 1,
    src: "/1.jpg",
    alt: "photo1",
  },
  {
    id: 2,
    src: "/2.jpg",
    alt: "photo2",
  },
  {
    id: 3,
    src: "/3.jpg",
    alt: "photo3",
  },
];

const renderModal = (props = {}) => {
  const onClose = vi.fn();
  const onChange = vi.fn();

  render(
    <ModalPhoto
      photos={photos}
      index={0}
      onClose={onClose}
      onChange={onChange}
      {...props}
    />
  );

  return { onClose, onChange };
};

describe("ModalPhoto", () => {
  it("renders current photo", () => {
    renderModal();

    expect(screen.getByTestId("main-photo")).toHaveAttribute("src", "/1.jpg");
    expect(screen.getByText("photo1")).toBeInTheDocument();
  });

  it("closes modal", async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not close when content clicked", async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByTestId("main-photo"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("goes to next photo", async () => {
    const user = userEvent.setup();
    const { onChange } = renderModal();

    await user.click(screen.getByRole("button", { name: /next photo/i }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("wraps to last photo", async () => {
    const user = userEvent.setup();
    const { onChange } = renderModal();

    await user.click(screen.getByRole("button", { name: /previous photo/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("goes next on ArrowRight", async () => {
    const user = userEvent.setup();
    const { onChange } = renderModal();

    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("goes previous on ArrowLeft", async () => {
    const user = userEvent.setup();
    const { onChange } = renderModal();

    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("changes photo when thumbnail clicked", async () => {
    const user = userEvent.setup();
    const { onChange } = renderModal();

    await user.click(screen.getByAltText("photo2"));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("scrolls thumbnail strip when index changes", () => {
    const scrollSpy = vi.spyOn(Element.prototype, "scrollTo");

    const { rerender } = render(
      <ModalPhoto
        photos={photos}
        index={0}
        onClose={vi.fn()}
        onChange={vi.fn()}
      />
    );

    rerender(
      <ModalPhoto
        photos={photos}
        index={1}
        onClose={vi.fn()}
        onChange={vi.fn()}
      />
    );

    expect(scrollSpy).toHaveBeenCalled();
  });
});
