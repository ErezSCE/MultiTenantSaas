import React, { useState, FormEvent } from 'react';
import { sendInvitation, InviteResponse } from '../api/invitation';

interface InviteMemberModalProps {
  /** Identifier of the tenant for which the invitation is created */
  tenantId: string;
  /** Callback invoked when the modal should be closed */
  onClose: () => void;
}

/**
 * Simple modal dialog allowing a tenant admin to invite a new member by email.
 * It displays a form, handles submission state, and shows success or error messages.
 */
export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ tenantId, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMessage('');
    try {
      const result: InviteResponse = await sendInvitation(tenantId, email);
      // For now we just consider success if no error thrown
      setStatus('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invitation failed';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <p>Sending invitation...</p>;
      case 'success':
        return (
          <div>
            <p>Invitation sent successfully!</p>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        );
      case 'error':
        return (
          <div>
            <p role="alert">Error: {errorMessage}</p>
            <button type="button" onClick={() => setStatus('idle')}>Retry</button>
          </div>
        );
      case 'idle':
      default:
        return (
          <form onSubmit={handleSubmit}>
            <label htmlFor="invite-email">Invitee Email</label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div style={{ marginTop: '1rem' }}>
              <button type="submit">Send Invitation</button>
              <button type="button" onClick={onClose} style={{ marginLeft: '0.5rem' }}>
                Cancel
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={modalOverlayStyle}
      onClick={(e) => {
        // close when clicking outside the dialog content
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={modalContentStyle}>{renderContent()}</div>
    </div>
  );
};

// Very basic inline styles for the modal – in a real app these would be extracted.
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '4px',
  minWidth: '300px',
};
