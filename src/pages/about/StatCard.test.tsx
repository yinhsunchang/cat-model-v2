import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import StatCard from "./StatCard";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("react-countup", () => ({
  default: ({ end }: { end: number }) => <span>{end}</span>,
}));

describe("StatCard", () => {
  it("renders all stat labels", () => {
    render(<StatCard />);

    expect(screen.getByText("about.stats.partners")).toBeInTheDocument();
    expect(screen.getByText("about.stats.projects")).toBeInTheDocument();
    expect(screen.getByText("about.stats.clients")).toBeInTheDocument();
    expect(screen.getByText("about.stats.meetings")).toBeInTheDocument();
  });

  it("renders all stat values", () => {
    render(<StatCard />);

    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("68")).toBeInTheDocument();
    expect(screen.getByText("39")).toBeInTheDocument();
    expect(screen.getByText("53")).toBeInTheDocument();
  });

  it("renders four stat items", () => {
    const { container } = render(<StatCard />);

    expect(container.querySelectorAll(".quarter")).toHaveLength(4);
  });
});
