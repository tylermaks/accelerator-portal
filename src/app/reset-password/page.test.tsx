import { render, screen } from "@testing-library/react";
import ResetPassword from "./page";

// Define and return the mock component inside the jest.mock callback
jest.mock("@/components/home/reset-password-form", () => {
  const MockResetPasswordForm = () => (
    <form aria-label="reset-password-form"><input aria-label="New Password" /></form>
  );
  MockResetPasswordForm.displayName = "MockResetPasswordForm";
  return MockResetPasswordForm;
});

describe("ResetPassword page", () => {
  it("shows error message if error param is present", () => {
    render(<ResetPassword searchParams={{ error: "invalid" }} />);
    expect(screen.getByText(/your link is invalid/i)).toBeInTheDocument();
    // Optionally, check that the form is not present
    expect(screen.queryByLabelText(/new password/i)).not.toBeInTheDocument();
  });

  it("shows form if error param is not present", () => {
    render(<ResetPassword searchParams={{}} />);
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });
}); 