import { sendReservationForm } from "./reservation";
import { supabase } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("sendReservationForm", () => {
  const mockInsert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as never);
  });

  it("inserts reservation successfully", async () => {
    mockInsert.mockResolvedValue({
      error: null,
    });

    const form = {
      name: "John",
      email: "john@test.com",
      date: "2026-07-28T18:00",
      message: "Window seat",
    };

    await expect(sendReservationForm(form)).resolves.toBeUndefined();

    expect(supabase.from).toHaveBeenCalledWith("reservations");
    expect(mockInsert).toHaveBeenCalledWith(form);
  });

  it("throws when Supabase returns an error", async () => {
    const error = new Error("Insert failed");

    mockInsert.mockResolvedValue({
      error,
    });

    const form = {
      name: "John",
      email: "john@test.com",
      date: "2026-07-28T18:00",
      message: "Window seat",
    };

    await expect(sendReservationForm(form)).rejects.toThrow("Insert failed");
  });
});
