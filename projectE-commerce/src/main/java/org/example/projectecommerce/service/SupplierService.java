package org.example.projectecommerce.service;

import org.example.projectecommerce.entity.Supplier;
import org.example.projectecommerce.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {
    @Autowired
    private SupplierRepository repo;

    public List<Supplier> getAll() {
        return repo.findAll();
    }

    public Supplier getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    public Supplier save(Supplier supplier) {
        return repo.save(supplier);
    }

    public Supplier update(Long id, Supplier supplier) {
        Supplier existing = getById(id);
        existing.setName(supplier.getName());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Supplier not found");
        }
        repo.deleteById(id);
    }
}
