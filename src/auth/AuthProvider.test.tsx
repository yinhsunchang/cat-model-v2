import { render, screen, waitFor } from "@testing-library/react";
import { supabase } from "../lib/supabase";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./useAuth";
import {
  AuthError,
  type AuthChangeEvent,
  type Session,
  type Subscription,
} from "@supabase/supabase-js";

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

function TestConsumer() {
  const { session, loading } = useAuth();

  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>

      <div data-testid="session">
        {session ? "authenticated" : "unauthenticated"}
      </div>
    </div>
  );
}

function createMockSubscription(): Subscription {
  return {
    id: "test-subscription",
    callback: vi.fn(),
    unsubscribe: vi.fn(),
  };
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription: createMockSubscription(),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("provides the current session after initialization", async () => {
    const session = {
      access_token: "test-token",
    } as Session;

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session,
      },
      error: null,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("true");

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("session")).toHaveTextContent("authenticated");

    expect(supabase.auth.getSession).toHaveBeenCalledOnce();
  });

  it("provides null session when user is not authenticated", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: null,
      },
      error: null,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("session")).toHaveTextContent("unauthenticated");
  });

  it("handles getSession error", async () => {
    const error = new AuthError("Failed to get session", 500);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: null,
      },
      error,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("session")).toHaveTextContent("unauthenticated");

    expect(consoleError).toHaveBeenCalledWith("Failed to get session:", error);
  });

  it("updates session when auth state changes", async () => {
    let authStateCallback:
      | ((event: AuthChangeEvent, session: Session | null) => Promise<void>)
      | undefined;

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: null,
      },
      error: null,
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(
      (callback) => {
        authStateCallback = callback;

        return {
          data: {
            subscription: createMockSubscription(),
          },
        };
      }
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("session")).toHaveTextContent("unauthenticated");

    const session = {
      access_token: "new-token",
    } as Session;

    await authStateCallback?.("SIGNED_IN", session);

    await waitFor(() => {
      expect(screen.getByTestId("session")).toHaveTextContent("authenticated");
    });
  });

  it("clears session when user signs out", async () => {
    let authStateCallback:
      | ((event: AuthChangeEvent, session: Session | null) => Promise<void>)
      | undefined;

    const session = {
      access_token: "existing-token",
    } as Session;

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session,
      },
      error: null,
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(
      (callback) => {
        authStateCallback = callback;

        return {
          data: {
            subscription: createMockSubscription(),
          },
        };
      }
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("session")).toHaveTextContent("authenticated");
    });

    await authStateCallback?.("SIGNED_OUT", null);

    await waitFor(() => {
      expect(screen.getByTestId("session")).toHaveTextContent(
        "unauthenticated"
      );
    });
  });

  it("unsubscribes when unmounted", () => {
    const subscription = createMockSubscription();

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: null,
      },
      error: null,
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription,
      },
    });

    const { unmount } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    unmount();

    expect(subscription.unsubscribe).toHaveBeenCalledOnce();
  });
});
