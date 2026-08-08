import React, { useState } from 'react';
import { InviteMemberModal } from '../components/InviteMemberModal';

const Home: React.FC = () => {
  const [showInvite, setShowInvite] = useState(false);
  const tenantId = 'tenant-123'; // placeholder for demo

  return (
    <div>
      <h1>Welcome to Multitenant SaaS</h1>
      <button onClick={() => setShowInvite(true)} data-testid="invite-button">
        Invite Member
      </button>
      {showInvite && (
        <InviteMemberModal
          tenantId={tenantId}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
};
export default Home;
