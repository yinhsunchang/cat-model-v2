import { renderHook } from "@testing-library/react";
import { useReservations } from "./useReservations";
import { ReservationsContext } from "./ReservationsContext";

describe("useReservations", () => {
  it("should return the reservations context", () => {
    const mockContext = {
      reservations: [],
      loading: false,
      deleteReservation: async () => {},
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ReservationsContext.Provider value={mockContext}>
        {children}
      </ReservationsContext.Provider>
    );

    const { result } = renderHook(() => useReservations(), {
      wrapper,
    });

    expect(result.current).toBe(mockContext);
  });

  it("should throw an error when used outside ReservationsProvider", () => {
    expect(() => {
      renderHook(() => useReservations());
    }).toThrow("useReservations must be used within ReservationsProvider");
  });
});
