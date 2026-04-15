import React, { useState, useEffect } from "react";
import ProductService from "../services/ProductService";
import CategoryService from "../services/CategoryService";
import SupplierService from "../services/SupplierService";
import AuthService from "../services/AuthService";
import ProductForm from "./ProductForm";
import "./Admin.css";

const Admin = ({ onLogout, hideSidebar = false }) => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSupplierName, setNewSupplierName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
        ProductService.getAllProductsAdmin(),
        CategoryService.getAllCategories(),
        SupplierService.getAllSuppliers(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setSuppliers(suppliersRes.data);
    } catch (err) {
      console.error("Erreur chargement données:", err);
      setError(`Erreur ${err.response?.status || ''}: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      try {
        await ProductService.deleteProduct(id);
        loadData();
        setSuccess("Produit supprimé avec succès");
        setError("");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        if (err.response?.status === 409) {
          const deactivate = window.confirm(
            `${err.response.data?.error || "Ce produit ne peut pas être supprimé car il est utilisé."}\n\nVoulez-vous le désactiver à la place ?`
          );
          if (deactivate) handleToggleProductActive(id, false);
        } else {
          setError(err.response?.data?.error || "Erreur lors de la suppression du produit");
        }
        setSuccess("");
      }
    }
  };

  const handleToggleProductActive = async (id, active) => {
    try {
      await ProductService.toggleProductActive(id, active);
      loadData();
      setSuccess(`Produit ${active ? "activé" : "désactivé"} avec succès`);
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || `Erreur lors de ${active ? "l'activation" : "la désactivation"}`);
      setSuccess("");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Supprimer cette catégorie ?")) {
      try {
        await CategoryService.deleteCategory(id);
        loadData();
        setSuccess("Catégorie supprimée avec succès");
        setError("");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || "Impossible de supprimer cette catégorie");
        setSuccess("");
      }
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm("Supprimer ce fournisseur ?")) {
      try {
        await SupplierService.deleteSupplier(id);
        loadData();
        setSuccess("Fournisseur supprimé avec succès");
        setError("");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.error || "Impossible de supprimer ce fournisseur");
        setSuccess("");
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await CategoryService.createCategory({ name: newCategoryName });
      setNewCategoryName("");
      loadData();
      setSuccess("Catégorie ajoutée avec succès");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'ajout de la catégorie");
      setSuccess("");
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (!newSupplierName.trim()) return;
    try {
      await SupplierService.createSupplier({ name: newSupplierName });
      setNewSupplierName("");
      loadData();
      setSuccess("Fournisseur ajouté avec succès");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'ajout du fournisseur");
      setSuccess("");
    }
  };

  return (
    <div className="admin-container">
      {!hideSidebar && (
        <div className="admin-header-bar">
          <h1>🛠️ Dashboard Admin</h1>
          <div className="admin-user-info">
            <span>👤 {AuthService.getUsername()}</span>
            <button className="logout-btn" onClick={onLogout}>Déconnexion</button>
          </div>
        </div>
      )}

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      <div className="admin-tabs">
        <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
          Produits
        </button>
        <button className={activeTab === "categories" ? "active" : ""} onClick={() => setActiveTab("categories")}>
          Catégories
        </button>
        <button className={activeTab === "suppliers" ? "active" : ""} onClick={() => setActiveTab("suppliers")}>
          Fournisseurs
        </button>
      </div>

      {loading && <div className="loading">⏳ Chargement...</div>}

      {activeTab === "products" && (
        <div className="admin-section">
          <h2>Produits</h2>
          <ProductForm onProductAdded={loadData} />
          <div className="admin-list">
            {products.map((product) => (
              <div key={product.id} className="admin-item">
                <div className="item-info">
                  <strong>{product.name}</strong> — {product.price}€
                  <span className={`status ${product.active ? "active" : "inactive"}`}>
                    {product.active ? "🟢 Actif" : "🔴 Inactif"}
                  </span>
                  {product.image && (
                    <img
                      src={`http://localhost:8080/uploads/${encodeURIComponent(product.image)}`}
                      alt={product.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                    />
                  )}
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => handleToggleProductActive(product.id, !product.active)}
                    className={product.active ? "deactivate-btn" : "activate-btn"}
                  >
                    {product.active ? "🔴 Désactiver" : "🟢 Activer"}
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)}>🗑️ Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="admin-section">
          <h2>Catégories</h2>
          <form onSubmit={handleAddCategory} className="add-form">
            <input
              type="text"
              placeholder="Nom de la catégorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
            <button type="submit">➕ Ajouter</button>
          </form>
          <div className="admin-list">
            {categories.map((category) => (
              <div key={category.id} className="admin-item">
                <div className="item-info">
                  <strong>{category.name}</strong>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleDeleteCategory(category.id)}>🗑️ Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "suppliers" && (
        <div className="admin-section">
          <h2>Fournisseurs</h2>
          <form onSubmit={handleAddSupplier} className="add-form">
            <input
              type="text"
              placeholder="Nom du fournisseur"
              value={newSupplierName}
              onChange={(e) => setNewSupplierName(e.target.value)}
              required
            />
            <button type="submit">➕ Ajouter</button>
          </form>
          <div className="admin-list">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="admin-item">
                <div className="item-info">
                  <strong>{supplier.name}</strong>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleDeleteSupplier(supplier.id)}>🗑️ Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
