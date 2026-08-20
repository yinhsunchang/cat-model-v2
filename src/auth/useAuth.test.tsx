import { renderHook } from "@testing-library/react";
import { AuthContext } from "./AuthContext";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  it("returns auth context when used inside AuthProvider", () => {
    const authValue = {
      session: null,
      loading: false,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });

    expect(result.current).toBe(authValue);
  });

  it("throws when used outside AuthProvider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used inside AuthProvider");
  });
});
