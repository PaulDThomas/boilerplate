import { render, screen } from "@testing-library/react";
import App from "./App";

test("Renders initial password screen", () => {
  render(<App />);
  const lblEmail = screen.getByText(/Email/);
  const lblPassword = screen.getByText(/Password/);
  const btnSubmit = screen.getByText(/Submit/);
  expect(lblEmail).toBeInTheDocument();
  expect(lblPassword).toBeInTheDocument();
  expect(btnSubmit).toBeInTheDocument();
});
