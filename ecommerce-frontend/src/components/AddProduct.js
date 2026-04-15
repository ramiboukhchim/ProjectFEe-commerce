import React, { useState, useEffect } from "react";
import ProductService from "../services/ProductService";
import CategoryService from "../services/CategoryService";
import SupplierService from "../services/SupplierService";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  useEffect(() => {
    CategoryService.getAllCategories().then(res => setCategories(res.data));
    SupplierService.getAllSuppliers().then(res => setSuppliers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload de l'image
    let imageName = "";
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      const res = await ProductService.uploadImage(formData);
      imageName = res.data;
    }

    const product = {
      name,
      price: parseFloat(price),
      image: imageName,
      category: { id: categoryId },
      supplier: { id: supplierId },
    };

    ProductService.createProduct(product)
      .then(() => alert("Produit ajouté !"))
      .catch(err => console.log(err));
  };

  return (
    <div className="add-product-form">
      <h2>Ajouter un produit</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom du produit" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="Prix" value={price} onChange={e => setPrice(e.target.value)} required />
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
          <option value="">Sélectionner une catégorie</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required>
          <option value="">Sélectionner un fournisseur</option>
          {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
        </select>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddProduct;