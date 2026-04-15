import React, { useState } from "react";
import ProductList from "./ProductList";
import Cart from "./Cart";
import { CartProvider } from "../contexts/CartContext";
import AuthService from "../services/AuthService";
import "./Client.css";

const Client = ({ onLogout }) => {
  const [showCart, setShowCart] = useState(false);

  return (
    <CartProvider>
      <div className="client-container">
        <div className="client-header">
          <h1>🛒 E-Commerce</h1>
          <div className="client-header-actions">
            <span className="client-username">👤 {AuthService.getUsername()}</span>
            <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
              {showCart ? "📋 Masquer le panier" : "🛒 Mon panier"}
            </button>
            <button className="client-logout-btn" onClick={onLogout}>
              Déconnexion
            </button>
          </div>
        </div>

        <div className="client-content">
          {showCart && <Cart />}
          <ProductList />
        </div>
      </div>
    </CartProvider>
  );
};

export default Client;
