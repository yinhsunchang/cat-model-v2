import { render, screen, act } from "@testing-library/react";
import SkillBar from "./SkillBar";

describe("SkillBar", () => {
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    observerCallback = vi.fn();

    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function (callback) {
        observerCallback = callback;

        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        };
      })
    );
  });

  it("renders label", () => {
    render(<SkillBar label="React" percentage={80} />);

    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("starts with 0 width before visible", () => {
    render(<SkillBar label="React" percentage={80} />);

    const bar = document.querySelector(".dark-grey");

    expect(bar).toHaveStyle({
      width: "0%",
    });
  });

  it("animates to percentage when visible", () => {
    render(<SkillBar label="React" percentage={80} />);

    const bar = document.querySelector(".dark-grey");

    expect(bar).toHaveStyle({
      width: "0%",
    });

    act(() => {
      observerCallback(
        [
          {
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(bar).toHaveStyle({
      width: "80%",
    });
  });

  it("does not animate when not visible", () => {
    render(<SkillBar label="React" percentage={80} />);

    const bar = document.querySelector(".dark-grey");

    act(() => {
      observerCallback(
        [
          {
            isIntersecting: false,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(bar).toHaveStyle({
      width: "0%",
    });
  });
});
