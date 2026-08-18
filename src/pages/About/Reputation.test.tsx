import { render, screen } from "@testing-library/react";
import Reputation from "./Reputation";
import type { PropsWithChildren } from "react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("swiper/react", () => ({
  Swiper: ({ children }: PropsWithChildren) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: PropsWithChildren) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

vi.mock("swiper/modules", () => ({
  Navigation: {},
  Pagination: {},
  Autoplay: {},
}));

describe("Reputation", () => {
  beforeEach(() => {
    render(<Reputation />);
  });

  it("renders title", () => {
    expect(screen.getByText("about.reputation.title")).toBeInTheDocument();
  });

  it("renders three testimonial cards", () => {
    expect(screen.getAllByTestId("swiper-slide")).toHaveLength(3);
  });

  it("renders testimonial names", () => {
    expect(
      screen.getByText("about.reputation.testimonial1")
    ).toBeInTheDocument();

    expect(
      screen.getByText("about.reputation.testimonial2")
    ).toBeInTheDocument();

    expect(
      screen.getByText("about.reputation.testimonial3")
    ).toBeInTheDocument();
  });

  it("renders three images", () => {
    expect(screen.getAllByRole("img")).toHaveLength(3);
  });
});
