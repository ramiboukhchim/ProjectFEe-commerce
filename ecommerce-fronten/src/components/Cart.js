import React from 'react';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, loading, error, removeLine, createOrder, clearCart } = useCart();

  if (loading) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">🛒 Panier</h2>
        <div className="cart-loading">⏳ Chargement du panier...</div>
      </div>
    );
  }

  if (!cart || !cart.lignes || cart.lignes.length === 0) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">🛒 Panier</h2>
        <div className="cart-empty">
          Votre panier est vide. 😢<br/>
          <small>Commencez à ajouter des produits !</small>
        </div>
      </div>
    );
  }

  const total = cart.lignes.reduce((sum, ligne) => sum + (ligne.product.price * ligne.quantite), 0);

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Panier</h2>
      
      {error && <div className="cart-error">{error}</div>}
      
      <ul className="cart-lines">
        {cart.lignes.map(ligne => (
          <li key={ligne.id} className="cart-line">
            <div className="line-info">
              <div className="line-product-name">{ligne.product.name}</div>
              <div className="line-details">
                <span className="line-quantity">Quantité: <strong>{ligne.quantite}</strong></span>
                <span>Prix unitaire: <strong>{ligne.product.price}€</strong></span>
                <span className="line-price">Sous-total: <strong>{(ligne.product.price * ligne.quantite).toFixed(2)}€</strong></span>
              </div>
            </div>
            <div className="line-actions">
              <button 
                className="remove-btn"
                onClick={() => removeLine(ligne.id)}
              >
                🗑️ Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="cart-summary">
        <div className="total-line">
          <span className="total-label">Total:</span>
          <span className="total-amount">{total.toFixed(2)}€</span>
        </div>
      </div>
      
      <div className="cart-actions">
        <button 
          className="validate-order-btn"
          onClick={createOrder}
          disabled={loading}
        >
          {loading ? '⏳ Traitement...' : '✅ Valider la commande'}
        </button>
        <button 
          className="reset-btn"
          onClick={clearCart}
          style={{ marginTop: '10px', background: '#ff6b6b', color: 'white' }}
        >
          🔄 Reset Panier (Debug)
        </button>
      </div>
    </div>
  );
};

export default Cart;