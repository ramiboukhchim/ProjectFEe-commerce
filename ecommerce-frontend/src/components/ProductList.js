import React, { useState, useEffect } from "react";
import ProductService from "../services/ProductService";
import ProductCard from "./ProductCard";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    ProductService.getAllProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">📦 Liste des produits</h2>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#667eea', fontSize: '1.2em' }}>
          ⏳ Chargement des produits...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#999', fontSize: '1.1em' }}>
          Aucun produit disponible
        </div>
      ) : (
        <div className="product-container">
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;