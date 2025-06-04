// Tests for the ForgotPassword component: rendering, submission, error handling, and loading feedback.
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPassword from "./forgot-password";

// Mock sendPasswordReset
const sendPasswordResetMock = jest.fn();
jest.mock("@/lib/supabase-actions", () => ({
  sendPasswordReset: (...args: unknown[]) => sendPasswordResetMock(...args),
}));

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    sendPasswordResetMock.mockReset();
  });

  it("renders the form and UI elements", () => {
    render(<ForgotPassword />);
    expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("submits a valid email and shows success message", async () => {
    sendPasswordResetMock.mockResolvedValue({ data: {}, status: undefined });
    render(<ForgotPassword />);
    await userEvent.type(screen.getByLabelText(/Email/i), "test@example.com");
    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() => {
      expect(
        screen.getByText(
          /If an account exists with this email a password reset link will be sent to your email/i
        )
      ).toBeInTheDocument();
    });
  });

  it("shows error for invalid email (status 400)", async () => {
    sendPasswordResetMock.mockResolvedValue({ status: 400 });
    render(<ForgotPassword />);
    await userEvent.type(screen.getByLabelText(/Email/i), "invalid@example.com");
    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
    });
  });

  it("shows server error message on exception", async () => {
    sendPasswordResetMock.mockRejectedValue(new Error("Server error"));
    render(<ForgotPassword />);
    await userEvent.type(screen.getByLabelText(/Email/i), "error@example.com");
    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/A server issue occurred, please try again/i)
      ).toBeInTheDocument();
    });
  });

  it("shows loading spinner while submitting", async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    sendPasswordResetMock.mockReturnValue(promise);
    render(<ForgotPassword />);
    await userEvent.type(screen.getByLabelText(/Email/i), "loading@example.com");
    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
}); 