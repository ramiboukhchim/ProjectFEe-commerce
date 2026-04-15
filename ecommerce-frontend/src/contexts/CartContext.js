import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CartService from '../services/CartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Fonction pour normaliser les données du panier
const normalizeCart = (data) => {
  if (Array.isArray(data)) {
    return { lignes: data };
  }
  if (data && Array.isArray(data.lignes)) {
    return data;
  }
  return { lignes: [] };
};

export const CartProvider = ({ children }) => {
  const [panierId, setPanierId] = useState(() => {
    const stored = localStorage.getItem('panierId');
    return stored && stored !== 'undefined' && stored !== 'null' ? stored : null;
  });
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser
  useEffect(() => {
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Charger le panier
  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Chargement du panier:', panierId || 'courant');
      const response = await CartService.getCart(panierId);
      console.log('Panier chargé:', response.data);
      setCart(normalizeCart(response.data));
      setError(null);
    } catch (err) {
      console.error('Erreur chargement panier:', err.message);
      if (err.response?.status === 404) {
        console.log('Panier non trouvé, initialisation avec panier vide');
        setCart({ lignes: [] });
      } else {
        setError('Erreur lors du chargement du panier');
      }
    } finally {
      setLoading(false);
    }
  }, [panierId]);

  // Ajouter un produit
  const addProduct = async (productId, qty = 1) => {
    setLoading(true);
    try {
      console.log('Ajout produit avec panierId:', panierId);
      const response = await CartService.addProductToCart(panierId, productId, qty);

      console.log('Réponse complète addProduct:', response);
      console.log('Données:', response.data);
      console.log('Status:', response.status);

      // Essayer de récupérer l'ID du panier depuis la réponse
      let actualPanierId = panierId;
      if (response.data) {
        if (response.data.panierId) {
          actualPanierId = response.data.panierId.toString();
        } else if (response.data.id) {
          actualPanierId = response.data.id.toString();
        } else if (typeof response.data === 'number') {
          actualPanierId = response.data.toString();
        } else if (typeof response.data === 'string') {
          actualPanierId = response.data;
        }
      }

      console.log('ID du panier utilisé:', actualPanierId);

      // Si l'ID a changé, le sauvegarder
      if (actualPanierId !== panierId && actualPanierId !== 'undefined' && actualPanierId !== 'null' && actualPanierId !== '') {
        setPanierId(actualPanierId);
        localStorage.setItem('panierId', actualPanierId);
      }

      setError(null);
      setCart(normalizeCart(response.data));
      await loadCart();
    } catch (err) {
      console.error('Erreur ajout:', err.message);
      console.error('Détails erreur:', err.response?.data);
      setError('❌ Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une ligne
  const removeLine = async (ligneId) => {
    try {
      await CartService.removeLineFromCart(panierId, ligneId);
      setError(null);
      setTimeout(() => loadCart(), 300);
    } catch (err) {
      console.error('Erreur suppression:', err.message);
      setError('❌ Erreur lors de la suppression');
    }
  };

  // Valider la commande
  const createOrder = async () => {
    try {
      await CartService.createOrderFromCart(panierId);
      setCart({ lignes: [] });
      setError(null);
      alert('✅ Commande créée avec succès !');
    } catch (err) {
      console.error('Erreur commande:', err.message);
      setError('❌ Erreur lors de la création de la commande');
    }
  };

  // Vider le panier (debug)
  const clearCart = () => {
    setPanierId(null);
    setCart(null);
    localStorage.removeItem('panierId');
    setError(null);
  };

  useEffect(() => {
    if (isInitialized) {
      loadCart();
    }
  }, [isInitialized, loadCart]);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      addProduct,
      removeLine,
      createOrder,
      clearCart,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};