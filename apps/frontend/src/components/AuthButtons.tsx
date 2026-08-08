import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthButtons: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  const handleLogin = () => loginWithRedirect();
  const handleLogout = () => logout({ returnTo: window.location.origin });

  if (isLoading) {
    // Show a simple loading state while Auth0 is initializing
    return <div>Loading authentication...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <button type="button" onClick={handleLogout}>Logout</button>
      ) : (
        <button type="button" onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default AuthButtons;
