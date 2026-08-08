/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InviteMemberModal } from './InviteMemberModal';

// Helper to mock fetch responses
function mockFetch(response: any, ok = true) {
  // @ts-ignore
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(''),
    })
  );
}

describe('InviteMemberModal', () => {
  const tenantId = 'tenant-123';
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form and sends invitation successfully', async () => {
    const mockResponse = { token: 'abc', expiresAt: new Date().toISOString() };
    mockFetch(mockResponse);

    render(<InviteMemberModal tenantId={tenantId} onClose={onClose} />);

    // Verify form elements are present
    const emailInput = screen.getByLabelText(/invitee email/i) as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send invitation/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(sendButton);

    // Loading state
    expect(screen.getByText(/sending invitation/i)).toBeInTheDocument();

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/invitation sent successfully/i)).toBeInTheDocument();
    });

    // Ensure fetch called with correct payload
    expect(global.fetch).toHaveBeenCalledWith('/auth/invite', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, email: 'test@example.com' }),
    }));
  });

  test('displays error message when invitation fails', async () => {
    // Simulate network error
    // @ts-ignore
    global.fetch = jest.fn().mockImplementation(() => Promise.reject(new Error('Network error')));

    render(<InviteMemberModal tenantId={tenantId} onClose={onClose} />);

    const emailInput = screen.getByLabelText(/invitee email/i) as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send invitation/i });

    fireEvent.change(emailInput, { target: { value: 'fail@example.com' } });
    fireEvent.click(sendButton);

    // Loading state
    expect(screen.getByText(/sending invitation/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/network error/i);
    });
  });
});
