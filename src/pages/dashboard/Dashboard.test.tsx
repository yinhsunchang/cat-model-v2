import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthError, type Session } from "@supabase/supabase-js";
import Dashboard from "./Dashboard";
import { useAuth } from "../../auth/useAuth";
import { supabase } from "../../lib/supabase";

const mockNavigate = vi.fn();

vi.mock("../../auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        "dashboard.title": "Dashboard",
        "dashboard.profile": "Profile",
        "dashboard.signout": "Sign out",
        "dashboard.signingout": "Signing out...",
        "dashboard.signoutError": "Failed to sign out",
      };

      return translations[key] ?? key;
    }),
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUseAuth = vi.mocked(useAuth);
const mockSignOut = vi.mocked(supabase.auth.signOut);

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

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
}

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      session: mockSession,
      loading: false,
    });

    mockSignOut.mockResolvedValue({
      error: null,
    });
  });

  it("renders dashboard title and user email", () => {
    renderDashboard();

    expect(
      screen.getByRole("heading", {
        name: "Dashboard",
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Email:\s*test@example\.com/)).toBeInTheDocument();
  });

  it("renders sign out button", () => {
    renderDashboard();

    expect(
      screen.getByRole("button", {
        name: "Sign out",
      })
    ).toBeInTheDocument();
  });

  it("signs out the user and navigates to /signin", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.click(
      screen.getByRole("button", {
        name: "Sign out",
      })
    );

    expect(mockSignOut).toHaveBeenCalledOnce();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/signin", { replace: true });
    });
  });

  it("shows loading state while signing out", async () => {
    const user = userEvent.setup();

    let resolveSignOut: ((value: { error: null }) => void) | undefined;

    mockSignOut.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignOut = resolve;
        })
    );

    renderDashboard();

    const button = screen.getByRole("button", {
      name: "Sign out",
    });

    await user.click(button);

    expect(
      screen.getByRole("button", {
        name: "Signing out...",
      })
    ).toBeDisabled();

    expect(mockSignOut).toHaveBeenCalledOnce();

    resolveSignOut?.({ error: null });

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Sign out",
        })
      ).not.toBeDisabled();
    });
  });

  it("shows an error when sign out fails", async () => {
    const user = userEvent.setup();

    const error = new AuthError("Sign out failed", 500);

    mockSignOut.mockResolvedValue({
      error,
    });

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderDashboard();

    await user.click(
      screen.getByRole("button", {
        name: "Sign out",
      })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to sign out"
    );

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(consoleErrorSpy).toHaveBeenCalledWith("Sign out failed:", error);

    consoleErrorSpy.mockRestore();
  });
});
