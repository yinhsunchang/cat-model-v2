import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CatFact from "./CatFact.tsx";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockFetch = vi.fn();

describe("CatFact", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("shows loading then fetched data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        fact: "Cats sleep 16 hours.",
        length: 21,
      }),
    });

    render(<CatFact />);

    expect(screen.getByText("fact.loading")).toBeInTheDocument();
    expect(await screen.findByText("Cats sleep 16 hours.")).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("https://catfact.ninja/fact");
  });

  it("shows error when fetch response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<CatFact />);

    expect(
      await screen.findByText("fact.errors.fetchError")
    ).toBeInTheDocument();
  });

  it("shows error when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"));

    render(<CatFact />);

    expect(
      await screen.findByText("fact.errors.fetchError")
    ).toBeInTheDocument();
  });

  it("fetches new fact after clicking next button", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          fact: "Fact A",
          length: 6,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          fact: "Fact B",
          length: 6,
        }),
      });

    const user = userEvent.setup();

    render(<CatFact />);

    expect(await screen.findByText("Fact A")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", {
        name: "fact.next",
      })
    );
    expect(await screen.findByText("Fact B")).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("calls API every 10 seconds", async () => {
    vi.useFakeTimers();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        fact: "test",
      }),
    });

    render(<CatFact />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
    await vi.advanceTimersByTimeAsync(10000);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("clears interval on unmount", () => {
    vi.useFakeTimers();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        fact: "Cat",
        length: 3,
      }),
    });

    const clearSpy = vi.spyOn(globalThis, "clearInterval");

    const { unmount } = render(<CatFact />);

    unmount();

    expect(clearSpy).toHaveBeenCalledOnce();
  });
});
