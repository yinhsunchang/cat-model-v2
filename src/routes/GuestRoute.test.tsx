import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import GuestRoute from "./GuestRoute";
import { useAuth } from "../auth/useAuth";

vi.mock("../auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => key),
  }),
}));

const mockSession = {
  access_token: "access-token",
  refresh_token: "refresh-token",
  expires_in: 3600,
  expires_at: 9999999999,
  token_type: "bearer",
  user: {
    id: "user-123",
    email: "test@example.com",
  },
} as Session;

const mockUseAuth = vi.mocked(useAuth);

function LocationDisplay() {
  const location = useLocation();

  return <div data-testid="location">{location.pathname}</div>;
}

describe("GuestRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state while authentication is loading", () => {
    mockUseAuth.mockReturnValue({
      session: null,
      loading: true,
    });

    render(
      <MemoryRouter initialEntries={["/signin"]}>
        <GuestRoute>
          <div>Guest content</div>
        </GuestRoute>
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toHaveTextContent("guestRoute.loading");

    expect(screen.queryByText("Guest content")).not.toBeInTheDocument();
  });

  it("redirects authenticated users to /dashboard", () => {
    mockUseAuth.mockReturnValue({
      session: mockSession,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/signin"]}>
        <GuestRoute>
          <div>Guest content</div>
        </GuestRoute>

        <LocationDisplay />
      </MemoryRouter>
    );

    expect(screen.getByTestId("location")).toHaveTextContent("/dashboard");

    expect(screen.queryByText("Guest content")).not.toBeInTheDocument();
  });

  it("renders children for unauthenticated users", () => {
    mockUseAuth.mockReturnValue({
      session: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/signin"]}>
        <GuestRoute>
          <div>Guest content</div>
        </GuestRoute>

        <LocationDisplay />
      </MemoryRouter>
    );

    expect(screen.getByText("Guest content")).toBeInTheDocument();

    expect(screen.getByTestId("location")).toHaveTextContent("/signin");
  });
});
