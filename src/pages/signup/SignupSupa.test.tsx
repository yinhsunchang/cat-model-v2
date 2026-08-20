import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Signup from "./SignupSupa";

// Mock Supabase
const { signUpMock } = vi.hoisted(() => ({
  signUpMock: vi.fn(),
}));

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: signUpMock,
    },
  },
}));

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "signup.title": "Create an account",
        "signup.signup": "Sign up",
        "signup.signin": "Sign in",
        "signup.already": "Already have an account?",
        "signup.email": "Email",
        "signup.password": "Password",
        "signup.required": "Please enter your email and password.",
        "signup.loading": "Creating account...",
        "signup.success": "Registration successful. Please check your email.",
      };

      return translations[key] ?? key;
    },
  }),
}));

const renderSignup = () => {
  return render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );
};

describe("Signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the signup form", () => {
    renderSignup();

    expect(
      screen.getByRole("heading", {
        name: "Create an account",
      })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();

    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Sign up",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Sign in",
      })
    ).toHaveAttribute("href", "/signin");
  });

  it("allows the user to enter email and password", async () => {
    const user = userEvent.setup();

    renderSignup();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");

    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");

    expect(passwordInput).toHaveValue("password123");
  });

  it("shows validation error when email or password is empty", async () => {
    const user = userEvent.setup();

    renderSignup();

    await user.click(
      screen.getByRole("button", {
        name: "Sign up",
      })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please enter your email and password."
    );

    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("calls Supabase signUp with email and password", async () => {
    const user = userEvent.setup();

    signUpMock.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    renderSignup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Sign up",
      })
    );

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledTimes(1);
    });

    expect(signUpMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("trims whitespace from email before signing up", async () => {
    const user = userEvent.setup();

    signUpMock.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    renderSignup();

    await user.type(screen.getByLabelText("Email"), "  test@example.com  ");

    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Sign up",
      })
    );

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows success message after successful signup", async () => {
    const user = userEvent.setup();

    signUpMock.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    renderSignup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Sign up",
      })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Registration successful. Please check your email."
    );
  });

  it("shows error message when Supabase signup fails", async () => {
    const user = userEvent.setup();

    signUpMock.mockResolvedValue({
      data: null,
      error: {
        message: "User already registered",
      },
    });

    renderSignup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Sign up",
      })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "User already registered"
    );
  });

  it("disables the button while signup is loading", async () => {
    const user = userEvent.setup();

    let resolveSignup!: (value: unknown) => void;

    signUpMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignup = resolve;
        })
    );

    renderSignup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Sign up",
      })
    );

    const loadingButton = screen.getByRole("button", {
      name: "Creating account...",
    });

    expect(loadingButton).toBeDisabled();

    resolveSignup({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Sign up",
        })
      ).not.toBeDisabled();
    });
  });

  it("prevents duplicate submissions while loading", async () => {
    const user = userEvent.setup();

    let resolveSignup!: (value: unknown) => void;

    signUpMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignup = resolve;
        })
    );

    renderSignup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "password123");

    const button = screen.getByRole("button", {
      name: "Sign up",
    });

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(signUpMock).toHaveBeenCalledTimes(1);

    resolveSignup({
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
});
