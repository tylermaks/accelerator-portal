// reset-password-form.test.tsx
// Integration and unit tests for the ResetPasswordForm component, including password validation and error handling.

import "@testing-library/jest-dom";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordForm from "./reset-password-form";
import * as z from "zod";

// Global mocks for getUser and updateUser
const getUserMock = jest.fn();
const updateUserMock = jest.fn();
jest.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: getUserMock,
      updateUser: updateUserMock,
    },
  }),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock next/image to avoid jsdom URL errors
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// -------------------
// Password validation
// -------------------
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

describe("Password validation", () => {
  it("rejects passwords shorter than 8 chars", () => {
    expect(passwordSchema.safeParse("Ab1!")).toHaveProperty("success", false);
  });
  it("requires uppercase, number, and special char", () => {
    expect(passwordSchema.safeParse("abcdefgh")).toHaveProperty("success", false);
    expect(passwordSchema.safeParse("Abcdefgh")).toHaveProperty("success", false);
    expect(passwordSchema.safeParse("Abcdefg1")).toHaveProperty("success", false);
    expect(passwordSchema.safeParse("Abcdefg!")).toHaveProperty("success", false);
    expect(passwordSchema.safeParse("Abcdef1!")).toHaveProperty("success", true);
  });
});

// -----------------------------
// ResetPasswordForm integration
// -----------------------------
describe("ResetPasswordForm integration", () => {
  beforeEach(() => {
    mockPush.mockClear();
    getUserMock.mockReset();
    getUserMock.mockResolvedValue({ data: { user: { id: "123" } } });
    updateUserMock.mockReset();
    updateUserMock.mockResolvedValue({ error: null });
    // Set the URL so window.location.search is correct for all tests
    window.history.pushState({}, '', '/reset-password?code=123');
  });

  it("submits and redirects on valid input", async () => {
    const { getByLabelText, getByText } = render(<ResetPasswordForm />);
    await userEvent.type(getByLabelText(/New Password/i), "Abcdef1!");
    await userEvent.type(getByLabelText(/Confirm Password/i), "Abcdef1!");
    await userEvent.click(getByText(/Submit/i));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });

  it("shows error if session is invalid", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    const { getByText } = render(<ResetPasswordForm />);
    await userEvent.click(getByText(/Submit/i));
    await waitFor(() => {
      expect(getByText(/session has expired/i)).toBeInTheDocument();
    });
  });

  it("shows error if passwords do not match", async () => {
    const { getByLabelText, getByText, findByText } = render(<ResetPasswordForm />);
    await userEvent.type(getByLabelText(/New Password/i), "Abcdef1!");
    await userEvent.type(getByLabelText(/Confirm Password/i), "Abcdef1@different");
    await userEvent.click(getByText(/Submit/i));
    expect(await findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("shows error if password is invalid", async () => {
    const { getByLabelText, getByText, findByText } = render(<ResetPasswordForm />);
    await userEvent.type(getByLabelText(/New Password/i), "abc");
    await userEvent.type(getByLabelText(/Confirm Password/i), "abc");
    await userEvent.click(getByText(/Submit/i));
    expect(await findByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
  });

  it("shows error if supabase returns an error", async () => {
    updateUserMock.mockResolvedValue({ error: { message: "Update failed" } });
    const { getByLabelText, getByText } = render(<ResetPasswordForm />);
    await userEvent.type(getByLabelText(/New Password/i), "Abcdef1!");
    await userEvent.type(getByLabelText(/Confirm Password/i), "Abcdef1!");
    await userEvent.click(getByText(/Submit/i));
    expect(updateUserMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.toLowerCase().includes("error updating password:")
        )
      ).toBeInTheDocument();
    });
  });
}); 