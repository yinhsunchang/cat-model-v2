import { reservationService } from "./supaReservation";
import { supabase } from "../lib/supabase";

import type { FormProps } from "../types/reservations";

vi.mock("../lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const mockReservations: FormProps[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    date: "2026-08-25",
    message: "Window seat please",
    created_at: "2026-08-20T10:00:00Z",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    date: "2026-08-26",
    message: "Birthday dinner",
    created_at: "2026-08-20T11:00:00Z",
  },
];

describe("reservationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getReservations", () => {
    it("should return reservations", async () => {
      const orderMock = vi.fn().mockResolvedValue({
        data: mockReservations,
        error: null,
      });

      const selectMock = vi.fn(() => ({
        order: orderMock,
      }));

      vi.mocked(supabase.from).mockReturnValue({
        select: selectMock,
      } as never);

      const result = await reservationService.getReservations();

      expect(result).toEqual(mockReservations);

      expect(supabase.from).toHaveBeenCalledWith("reservations");

      expect(selectMock).toHaveBeenCalledWith("*");

      expect(orderMock).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
    });

    it("should throw when Supabase returns an error", async () => {
      const error = new Error("Failed to fetch reservations");

      const orderMock = vi.fn().mockResolvedValue({
        data: null,
        error,
      });

      const selectMock = vi.fn(() => ({
        order: orderMock,
      }));

      vi.mocked(supabase.from).mockReturnValue({
        select: selectMock,
      } as never);

      await expect(reservationService.getReservations()).rejects.toThrow(
        "Failed to fetch reservations"
      );
    });
  });

  describe("deleteReservation", () => {
    it("should delete a reservation by id", async () => {
      const eqMock = vi.fn().mockResolvedValue({
        error: null,
      });

      const deleteMock = vi.fn(() => ({
        eq: eqMock,
      }));

      vi.mocked(supabase.from).mockReturnValue({
        delete: deleteMock,
      } as never);

      await reservationService.deleteReservation(123);

      expect(supabase.from).toHaveBeenCalledWith("reservations");

      expect(deleteMock).toHaveBeenCalledTimes(1);

      expect(eqMock).toHaveBeenCalledWith("id", 123);
    });

    it("should throw when Supabase returns an error", async () => {
      const error = new Error("Failed to delete reservation");

      const eqMock = vi.fn().mockResolvedValue({
        error,
      });

      const deleteMock = vi.fn(() => ({
        eq: eqMock,
      }));

      vi.mocked(supabase.from).mockReturnValue({
        delete: deleteMock,
      } as never);

      await expect(reservationService.deleteReservation(123)).rejects.toThrow(
        "Failed to delete reservation"
      );
    });
  });
});
