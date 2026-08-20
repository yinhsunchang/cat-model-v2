import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Signin from "./SigninSupa";

const { signInWithPasswordMock } = vi.hoisted(() => ({
  signInWithPasswordMock: vi.fn(),
}));

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: signInWithPasswordMock,
    },
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "signin.title": "Sign in",
        "signin.email": "Email",
        "signin.password": "Password",
        "signin.emailPlaceholder": "you@example.com",
        "signin.passwordPlaceholder": "Enter your password",
        "signin.required": "Please enter your email and password.",
        "signin.loading": "Signing in...",
        "signin.signin": "Sign in",
        "signin.notyet": "Don't have an account yet?",
        "signin.signup": "Sign up",
      };

      return translations[key] ?? key;
    },
  }),
}));

const renderSignin = () => {
  return render(
    <MemoryRouter>
      <Signin />
    </MemoryRouter>
  );
};

describe("Signin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the signin form", () => {
    renderSignin();

    expect(
      screen.getByRole("heading", {
        name: "Sign in",
      })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();

    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Sign in",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Sign up",
      })
    ).toHaveAttribute("href", "/signup");
  });

  it("allows the user to enter email and password", async () => {
    const user = userEvent.setup();

    renderSignin();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");

    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");

    expect(passwordInput).toHaveValue("password123");
  });

  it("shows validation error when email or password is empty", async () => {
    const user = userEvent.setup();

    renderSignin();

    await user.click(
      screen.getByRole("button", {
        name: "Sign in",
      })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please enter your email and password."
    );

    expect(signInWithPasswordMock).not.toHaveBeenCalled();

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("calls Supabase signInWithPassword with email and password", async () => {
    const user = userEvent.setup();

    signInWithPasswordMock.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    renderSignin();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Sign in",
      })
    );

    await waitFor(() => {
      expect(signInWithPasswordMock).toHaveBeenCalledTimes(1);
    });

    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("trims whitespace from email before signing in", async () => {
    const user = userEvent.setup();

    signInWithPasswordMock.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    renderSignin();

    await user.type(screen.getByLabelText("Email"), "  test@example.com  ");

    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Sign in",
      })
    );

    await waitFor(() => {
      expect(signInWithPasswordMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("navigates to dashboard after successful signin", async () => {
    const user = userEvent.setup();

    signInWithPasswordMock.mockResolvedValue({
      data: {
        user: {
          id: "user-123",
        },
        session: {
          access_token: "fake-token",
        },
      },
      error: null,
    });

    renderSignin();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Sign in",
      })
    );

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });

    expect(navigateMock).toHaveBeenCalledTimes(1);
  });

  it("shows error message when Supabase signin fails", async () => {
    const user = userEvent.setup();

    signInWithPasswordMock.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: {
        message: "Invalid login credentials",
      },
    });

    renderSignin();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "wrong-password");

    await user.click(
      screen.getByRole("button", {
        name: "Sign in",
      })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid login credentials"
    );

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("does not navigate when signin fails", async () => {
    const user = userEvent.setup();

    signInWithPasswordMock.mockResolvedValue({
      data: null,
      error: {
        message: "Invalid login credentials",
      },
    });

    renderSignin();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "wrong-password");

    await user.click(
      screen.getByRole("button", {
        name: "Sign in",
      })
    );

    await waitFor(() => {
      expect(signInWithPasswordMock).toHaveBeenCalledTimes(1);
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("disables the button while signin is loading", async () => {
    const user = userEvent.setup();

    let resolveSignin!: (value: unknown) => void;

    const signinPromise = new Promise((resolve) => {
      resolveSignin = resolve;
    });

    signInWithPasswordMock.mockReturnValue(signinPromise);

    renderSignin();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Sign in",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Signing in...",
      })
    ).toBeDisabled();

    resolveSignin({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Sign in",
        })
      ).not.toBeDisabled();
    });
  });

  it("prevents duplicate submissions while loading", async () => {
    const user = userEvent.setup();

    let resolveSignin!: (value: unknown) => void;

    const signinPromise = new Promise((resolve) => {
      resolveSignin = resolve;
    });

    signInWithPasswordMock.mockReturnValue(signinPromise);

    renderSignin();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "password123");

    const button = screen.getByRole("button", {
      name: "Sign in",
    });

    await user.click(button);

    expect(signInWithPasswordMock).toHaveBeenCalledTimes(1);

    expect(button).toBeDisabled();

    await user.click(button);
    await user.click(button);

    expect(signInWithPasswordMock).toHaveBeenCalledTimes(1);

    resolveSignin({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("allows the user to navigate to signup", async () => {
    const user = userEvent.setup();

    renderSignin();

    const signupLink = screen.getByRole("link", {
      name: "Sign up",
    });

    expect(signupLink).toHaveAttribute("href", "/signup");

    await user.click(signupLink);

    expect(signupLink).toHaveAttribute("href", "/signup");
  });
});
