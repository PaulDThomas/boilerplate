import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders password screen', () => {
  render(<App />);
  const lblEmail = screen.getByText(/Email/);
  const lblPassword = screen.getByText(/Password/);
  const btnSubmit = screen.getByText(/Submit/);
  expect(lblEmail).toBeInTheDocument();
  expect(lblPassword).toBeInTheDocument();
  expect(btnSubmit).toBeInTheDocument();
});
test('IDs are available', () => {
  const dom = render(<App />);
  const inputUid = dom.container.querySelector('#form-login-uid');
  const inputPwd = dom.container.querySelector('#form-login-pwd');
  expect(inputUid).toBeInTheDocument();
  expect(inputPwd).toBeInTheDocument();
});
