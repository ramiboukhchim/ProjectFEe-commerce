import React, { useState } from "react";
import AuthService from "./services/AuthService";
import AuthPage from "./components/AuthPage";
import Admin from "./components/Admin";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import Client from "./components/Client";
import "./App.css";

// Initialiser le header axios immédiatement au chargement du module
AuthService.initAxios();

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: AuthService.isAuthenticated(),
    roles: AuthService.getRoles(),
  });

  const handleAuthSuccess = (data) => {
    setAuthState({
      isAuthenticated: true,
      roles: data.roles,
    });
  };

  const handleLogout = () => {
    AuthService.logout();
    setAuthState({ isAuthenticated: false, roles: [] });
  };

  if (!authState.isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const roles = authState.roles;

  if (roles.includes("SUPER_ADMIN")) {
    return <SuperAdminDashboard onLogout={handleLogout} />;
  }

  if (roles.includes("ADMIN")) {
    return <Admin onLogout={handleLogout} />;
  }

  // CLIENT ou tout autre rôle
  return <Client onLogout={handleLogout} />;
}

export default App;
