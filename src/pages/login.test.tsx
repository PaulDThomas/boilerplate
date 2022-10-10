import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from './login';

describe('Type entries', () => {
  test('Elements there', async () => {
    render(<Login />);
    const inputUid = screen.getByLabelText('Email');
    const inputPwd = screen.getByLabelText('Password');
    const btnSubmit = screen.getByRole('button');
    expect(inputUid).toBeInTheDocument();
    expect(inputPwd).toBeInTheDocument();
    expect(btnSubmit).toBeInTheDocument();
  });

  test('Fail no input', async () => {
    render(<Login />);
    const btnSubmit = screen.getByRole('button');
    userEvent.click(btnSubmit);
    const validUid = screen.queryByText(/valid email/i);
    const validPwd = screen.queryByText(/8 char/i);
    expect(validUid).toBeInTheDocument();
    expect(validPwd).toBeInTheDocument();
  });

  test('Submit input', async () => {
    // Render
    render(<Login />);
    // Add text
    const inputUid = screen.getByLabelText('Email');
    const inputPwd = screen.getByLabelText('Password');
    const btnSubmit = screen.getByRole('button');
    userEvent.type(inputUid, 'paul@asup.co.uk');
    userEvent.type(inputPwd, 'password');
    userEvent.click(btnSubmit);

    // Check no warnings
    const validUid = screen.queryByText(/valid email/i);
    const validPwd = screen.queryByText(/8 char/i);
    expect(validUid).not.toBeInTheDocument();
    expect(validPwd).not.toBeInTheDocument();
  });
});
