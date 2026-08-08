import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthButtons from './AuthButtons';

jest.mock('@auth0/auth0-react', () => {
  return {
    useAuth0: jest.fn(),
  };
});

const mockedUseAuth0 = require('@auth0/auth0-react').useAuth0 as jest.Mock;

describe('AuthButtons component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Login button when not authenticated and calls loginWithRedirect on click', () => {
    const loginMock = jest.fn();
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: loginMock,
      logout: jest.fn(),
    });

    render(<AuthButtons />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    expect(loginMock).toHaveBeenCalledTimes(1);
  });

  it('renders Logout button when authenticated and calls logout on click', () => {
    const logoutMock = jest.fn();
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      logout: logoutMock,
    });

    render(<AuthButtons />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
