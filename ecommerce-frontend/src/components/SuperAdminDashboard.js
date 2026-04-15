import React, { useState, useEffect } from "react";
import axios from "axios";
import Admin from "./Admin";
import AuthService from "../services/AuthService";
import "./SuperAdminDashboard.css";

const API = "http://localhost:8080/api/super-admin/users";
const AVAILABLE_ROLES = ["CLIENT", "ADMIN", "SUPER_ADMIN"];

const SuperAdminDashboard = ({ onLogout }) => {
  const [view, setView] = useState("admin");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoles, setNewRoles] = useState(["CLIENT"]);

  useEffect(() => {
    if (view === "users") loadUsers();
  }, [view]);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (err) {
      setError(`Erreur ${err.response?.status || ''}: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim() || newRoles.length === 0) return;
    try {
      // Build query string: ?roles=CLIENT&roles=ADMIN
      const params = new URLSearchParams();
      newRoles.forEach((r) => params.append("roles", r));

      await axios.post(`${API}?${params.toString()}`, {
        username: newUsername,
        password: newPassword,
      });
      setNewUsername("");
      setNewPassword("");
      setNewRoles(["CLIENT"]);
      loadUsers();
      setSuccess("Utilisateur créé avec succès");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`Erreur ${err.response?.status || ''}: ${err.response?.data?.error || err.response?.data?.message || err.message}`);
      setSuccess("");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      loadUsers();
      setSuccess("Utilisateur supprimé");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const handleUpdateRoles = async (userId, roles) => {
    try {
      await axios.put(`${API}/${userId}/roles`, roles);
      loadUsers();
      setSuccess("Rôles mis à jour");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour des rôles");
    }
  };

  const toggleRoleForUser = (user, roleName) => {
    const currentRoles = user.roles.map((r) => r.name);
    const updated = currentRoles.includes(roleName)
      ? currentRoles.filter((r) => r !== roleName)
      : [...currentRoles, roleName];
    if (updated.length === 0) {
      setError("Un utilisateur doit avoir au moins un rôle");
      return;
    }
    handleUpdateRoles(user.id, updated);
  };

  return (
    <div className="super-admin-wrapper">
      <div className="super-admin-sidebar">
        <div className="sidebar-brand">
          <span>👑</span>
          <span>Super Admin</span>
        </div>
        <div className="sidebar-user">👤 {AuthService.getUsername()}</div>
        <nav className="sidebar-nav">
          <button
            className={view === "admin" ? "sidebar-btn active" : "sidebar-btn"}
            onClick={() => setView("admin")}
          >
            🛠️ Gestion Produits
          </button>
          <button
            className={view === "users" ? "sidebar-btn active" : "sidebar-btn"}
            onClick={() => setView("users")}
          >
            👥 Gestion Utilisateurs
          </button>
        </nav>
        <button className="sidebar-logout" onClick={onLogout}>
          🚪 Déconnexion
        </button>
      </div>

      <div className="super-admin-content">
        {view === "admin" && <Admin onLogout={onLogout} hideSidebar />}

        {view === "users" && (
          <div className="users-panel">
            <h2>👥 Gestion des Utilisateurs</h2>

            {error && <div className="sa-alert error">{error}</div>}
            {success && <div className="sa-alert success">{success}</div>}

            <div className="sa-card">
              <h3>Créer un utilisateur</h3>
              <form onSubmit={handleCreateUser} className="sa-form">
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <div className="role-checkboxes">
                  {AVAILABLE_ROLES.map((role) => (
                    <label key={role} className="role-check">
                      <input
                        type="checkbox"
                        checked={newRoles.includes(role)}
                        onChange={(e) =>
                          setNewRoles(
                            e.target.checked
                              ? [...newRoles, role]
                              : newRoles.filter((r) => r !== role)
                          )
                        }
                      />
                      {role}
                    </label>
                  ))}
                </div>
                <button type="submit" className="sa-btn primary">➕ Créer</button>
              </form>
            </div>

            {loading ? (
              <div className="loading">⏳ Chargement...</div>
            ) : (
              <div className="users-list">
                {users.map((user) => (
                  <div key={user.id} className="user-item">
                    <div className="user-info">
                      <strong>👤 {user.username}</strong>
                      <div className="user-roles">
                        {AVAILABLE_ROLES.map((role) => {
                          const hasRole = user.roles?.some((r) => r.name === role);
                          return (
                            <button
                              key={role}
                              className={`role-badge ${hasRole ? "has-role" : "no-role"}`}
                              onClick={() => toggleRoleForUser(user, role)}
                              title={hasRole ? `Retirer ${role}` : `Ajouter ${role}`}
                            >
                              {hasRole ? "✅" : "⬜"} {role}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <button
                      className="sa-btn danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
