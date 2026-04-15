import React, { useState, useEffect } from "react";
import ProductService from "../services/ProductService";
import CategoryService from "../services/CategoryService";
import SupplierService from "../services/SupplierService";
import "./ProductForm.css";

const ProductForm = ({ onProductAdded }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategoriesAndSuppliers();
  }, []);

  const loadCategoriesAndSuppliers = async () => {
    try {
      const [categoriesRes, suppliersRes] = await Promise.all([
        CategoryService.getAllCategories(),
        SupplierService.getAllSuppliers()
      ]);
      setCategories(categoriesRes.data);
      setSuppliers(suppliersRes.data);
    } catch (error) {
      console.error('Erreur chargement catégories/fournisseurs:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      let imageName = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await ProductService.uploadImage(formData);
        imageName = res.data;
      }

      const product = {
        name,
        price: parseFloat(price),
        image: imageName,
        category: { id: parseInt(categoryId) },
        supplier: { id: parseInt(supplierId) }
      };

      await ProductService.createProduct(product);
      setMessage("✅ Produit ajouté avec succès !");
      onProductAdded();
      
      // Réinitialiser le formulaire
      setTimeout(() => {
        setName("");
        setPrice("");
        setCategoryId("");
        setSupplierId("");
        setFile(null);
        setImagePreview(null);
        setMessage(null);
      }, 1500);
    } catch (err) {
      setError("❌ Erreur lors de l'ajout du produit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setPrice("");
    setCategoryId("");
    setSupplierId("");
    setFile(null);
    setImagePreview(null);
    setMessage(null);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form-container">
      <h2 className="form-title">➕ Ajouter un nouveau produit</h2>

      {message && <div className="form-alert alert-success">{message}</div>}
      {error && <div className="form-alert alert-error">{error}</div>}

      {imagePreview && (
        <div className="image-preview-container">
          <div className="image-preview">
            <img src={imagePreview} alt="Aperçu" />
          </div>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Nom du produit <span className="required">*</span>
          </label>
          <input
            className="form-input"
            placeholder="Ex: iPhone 15"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Prix (€) <span className="required">*</span>
          </label>
          <input
            className="form-input"
            type="number"
            step="0.01"
            min="0"
            placeholder="Ex: 999.99"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Catégorie <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Fournisseur <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={supplierId}
            onChange={e => setSupplierId(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Sélectionner un fournisseur</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group full">
          <label className="form-label">
            Image du produit
          </label>
          <div className="file-input-wrapper">
            <label className="file-input-label">
              📸 Cliquer pour sélectionner une image
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                disabled={loading}
              />
            </label>
            {file && (
              <span className="file-name">
                ✓ Fichier: {file.name}
              </span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Ajout en cours...
              </>
            ) : (
              <>
                🛒 Ajouter le produit
              </>
            )}
          </button>
          <button
            type="button"
            className="reset-btn"
            onClick={handleReset}
            disabled={loading}
          >
            🔄 Réinitialiser
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;