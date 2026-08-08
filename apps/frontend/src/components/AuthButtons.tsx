import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthButtons: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const handleLogin = () => loginWithRedirect();
  const handleLogout = () => logout({ returnTo: window.location.origin });

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default AuthButtons;
