import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const { addProduct, loading } = useCart();

  const handleAddToCart = () => {
    addProduct(product.id, 1);
  };

  // Log pour déboguer
  console.log('ProductCard - product.image:', product.image);

  const imageUrl = product.image && !imageError
    ? `http://localhost:8080/uploads/${encodeURIComponent(product.image)}`
    : '/placeholder.svg';

  console.log('ProductCard - imageUrl générée:', imageUrl);

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={imageUrl}
          alt={product.name}
          onError={(e) => {
            console.log('Erreur chargement image pour:', product.name, 'URL:', imageUrl);
            setImageError(true);
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="product-price">{product.price} €</div>
        <div className="product-supplier">
          {product.supplier?.name || 'Non spécifié'}
        </div>
        <div className="product-category">
          {product.category?.name || 'Non spécifié'}
        </div>
      </div>
      <div className="product-actions">
        <button 
          className="add-to-cart-btn" 
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? '⏳ Ajout...' : '🛒 Ajouter au panier'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;