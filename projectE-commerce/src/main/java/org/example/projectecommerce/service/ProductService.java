package org.example.projectecommerce.service;

import org.example.projectecommerce.entity.Category;
import org.example.projectecommerce.entity.Product;
import org.example.projectecommerce.entity.Supplier;
import org.example.projectecommerce.repository.CategoryRepository;
import org.example.projectecommerce.repository.ProductRepository;
import org.example.projectecommerce.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private SupplierRepository supplierRepo;

    public List<Product> getAllActive() {
        return repo.findByActiveTrue();
    }

    public List<Product> getAllForAdmin() {
        return repo.findAll();
    }

    public Product getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product save(Product product) {
        if (!product.isActive()) {
            product.setActive(true);
        }
        attachRelations(product);
        return repo.save(product);
    }

    public Product update(Long id, Product product) {
        Product existing = getById(id);
        existing.setName(product.getName());
        existing.setPrice(product.getPrice());
        existing.setImage(product.getImage());
        existing.setCategory(product.getCategory());
        existing.setSupplier(product.getSupplier());
        existing.setActive(product.isActive());
        attachRelations(existing);
        return repo.save(existing);
    }

    public Product setActive(Long id, boolean active) {
        Product product = getById(id);
        product.setActive(active);
        return repo.save(product);
    }

    public void delete(Long id) {
        Product product = getById(id);
        try {
            repo.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            product.setActive(false);
            repo.save(product);
            throw new RuntimeException("Suppression physique impossible: le produit a ete desactive car il est deja utilise.");
        }
    }

    private void attachRelations(Product product) {
        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new RuntimeException("Category not found");
        }
        if (product.getSupplier() == null || product.getSupplier().getId() == null) {
            throw new RuntimeException("Supplier not found");
        }

        Category category = categoryRepo.findById(product.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Supplier supplier = supplierRepo.findById(product.getSupplier().getId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        product.setCategory(category);
        product.setSupplier(supplier);
    }
}
