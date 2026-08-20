import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import ProtectedRoute from "./ProtectedRoute";
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

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state while authentication is loading", () => {
    mockUseAuth.mockReturnValue({
      session: null,
      loading: true,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "protectedRoute.loading"
    );

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users to /signin", () => {
    mockUseAuth.mockReturnValue({
      session: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>

        <LocationDisplay />
      </MemoryRouter>
    );

    expect(screen.getByTestId("location")).toHaveTextContent("/signin");

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    mockUseAuth.mockReturnValue({
      session: mockSession,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>

        <LocationDisplay />
      </MemoryRouter>
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();

    expect(screen.getByTestId("location")).toHaveTextContent("/dashboard");
  });
});
