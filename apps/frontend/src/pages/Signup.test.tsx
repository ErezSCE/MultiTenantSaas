import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from './Signup';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Signup component', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset();
  });

  it('shows success message on successful registration', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        /registration successful/i,
      );
    });
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/signup', {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret123',
    });
  });

  it('displays error message when API returns an error', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    });

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Email already exists');
    });
    expect(mockedAxios.post).toHaveBeenCalled();
  });
});
