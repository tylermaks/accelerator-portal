// Tests for the ConfirmReset page: rendering, submission, error handling, and navigation.
const verifyOtpMock = jest.fn();
const createClientMock = () => ({ auth: { verifyOtp: verifyOtpMock } });

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmReset from "./page";

// Mock next/navigation useRouter
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// Mock supabase client
jest.mock("@/utils/supabase/client", () => ({
  createClient: createClientMock,
}));

// Mock next/image to avoid jsdom issues
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("ConfirmReset Page", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location.search
    Object.defineProperty(window, "location", {
      writable: true,
      value: { search: "?url=/reset-password&email=test@example.com" },
    });
    pushMock.mockReset();
    verifyOtpMock.mockReset();
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("renders the main UI elements", () => {
    render(<ConfirmReset />);
    expect(screen.getByText(/Confirm password reset/i)).toBeInTheDocument();
    expect(screen.getByText(/To proceed with resetting your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset Password/i })).toBeInTheDocument();
  });

  it("successfully confirms password reset and redirects", async () => {
    verifyOtpMock.mockResolvedValue({ error: null });
    render(<ConfirmReset />);
    await userEvent.click(screen.getByRole("button", { name: /Reset Password/i }));
    await waitFor(() => {
      expect(verifyOtpMock).toHaveBeenCalledWith({
        token: "/reset-password",
        email: "test@example.com",
        type: "recovery",
      });
      expect(pushMock).toHaveBeenCalledWith("/reset-password");
    });
  });

  it("shows error message for invalid or expired link", async () => {
    verifyOtpMock.mockResolvedValue({ error: { message: "Invalid" } });
    render(<ConfirmReset />);
    await userEvent.click(screen.getByRole("button", { name: /Reset Password/i }));
    await waitFor(() => {
      expect(screen.getByText(/Invalid or expired reset link/i)).toBeInTheDocument();
      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  it("button is clickable and triggers handler", async () => {
    verifyOtpMock.mockResolvedValue({ error: null });
    render(<ConfirmReset />);
    const button = screen.getByRole("button", { name: /Reset Password/i });
    await userEvent.click(button);
    expect(verifyOtpMock).toHaveBeenCalled();
  });
}); 