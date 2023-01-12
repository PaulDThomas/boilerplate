import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { Login } from './login';

jest.mock('axios');

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
    // Set up user
    const user = userEvent.setup();
    // Render
    await act(async () => {
      render(<Login />);
    });
    // Click the button
    const btnSubmit = screen.getByRole('button');
    await user.click(btnSubmit);
    // Do checks
    const validUid = screen.queryByText(/valid email/i);
    const validPwd = screen.queryByText(/8 char/i);
    expect(validUid).toBeInTheDocument();
    expect(validPwd).toBeInTheDocument();
  });

  test('Submit input', async () => {
    // Set up user
    const user = userEvent.setup();
    // Render
    render(<Login />);
    // Add text, check submit calls axios
    const inputUid = screen.getByLabelText('Email');
    const inputPwd = screen.getByLabelText('Password');
    const btnSubmit = screen.getByRole('button');
    const axiosCalls = jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: 'POST' });
    await user.type(inputUid, 'paul@asup.co.uk');
    await user.type(inputPwd, 'password1');
    await user.click(btnSubmit);
    expect(axiosCalls).toBeCalledWith('/login.php', {
      email: 'paul@asup.co.uk',
      password: 'password1',
    });
    expect(axiosCalls).toBeCalledTimes(1);

    // Check no warnings
    const validUid = screen.queryByText(/valid email/i);
    const validPwd = screen.queryByText(/8 char/i);
    expect(validUid).not.toBeInTheDocument();
    expect(validPwd).not.toBeInTheDocument();
  });

  test('Show nothing', async () => {
    render(
      <AuthContext.Provider
        value={{
          userPK: 2,
          logout: () => {
            return;
          },
          saveToken: () => {
            return;
          },
          getToken: () => '1234',
        }}
      >
        <Login />
      </AuthContext.Provider>,
    );
    const inputUid = screen.queryByLabelText('Email');
    expect(inputUid).not.toBeInTheDocument();
  });

  test('Hit error with bad post return', async () => {
    // Set up user
    const user = userEvent.setup();
    // Render
    render(<Login />);
    // Add text, check submit calls axios
    const inputUid = screen.getByLabelText('Email');
    const inputPwd = screen.getByLabelText('Password');
    const btnSubmit = screen.getByRole('button');
    const axiosCalls = jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('fail'));
    await user.type(inputUid, 'paul@asup.co.uk');
    await user.type(inputPwd, 'password2');
    await user.click(btnSubmit);
    expect(axiosCalls).toBeCalledWith('/login.php', {
      email: 'paul@asup.co.uk',
      password: 'password2',
    });
    expect(axiosCalls).toBeCalledTimes(1);
  });
});
